import { useCallback, useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { env } from "@/env"
import useToast from "./use-toast"

export interface ChatMessage {
  id: string
  appointmentId: string
  content: string | null
  messageType: "TEXT" | "IMAGE" | "FILE" | "SYSTEM"
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null
  isDelivered: boolean
  isRead: boolean
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    name: string
    email: string
    image: string | null
    role: string | null
  }
}

interface UseChatProps {
  appointmentId?: string
  userId: string
  role: "doctor" | "patient"
  socketUrl?: string
  useChatroom?: boolean
}

export function useChat({
  appointmentId,
  userId,
  role,
  socketUrl,
  useChatroom = false,
}: UseChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [onlineUsers, setOnlineUsers] = useState<
    Array<{
      userId: string
      name: string
      role: string | null
      lastSeen: string
    }>
  >([])
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toastError } = useToast()
  const toastErrorRef = useRef(toastError)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  // Track recently processed message IDs to prevent rapid duplicates
  const recentMessageIdsRef = useRef<Set<string>>(new Set())
  // Track pending sends to prevent duplicate sends
  const pendingSendsRef = useRef<Set<string>>(new Set())
  const [isSending, setIsSending] = useState(false)
  // Use ref for synchronous checking (state updates are async)
  const isSendingRef = useRef(false)

  // Keep toastError ref up to date
  useEffect(() => {
    toastErrorRef.current = toastError
  }, [toastError])

  // Use provided socketUrl or default to app URL
  const finalSocketUrl = socketUrl || env.NEXT_PUBLIC_APP_URL

  // biome-ignore lint/correctness/useExhaustiveDependencies: toastError is accessed via ref to prevent infinite re-renders
  useEffect(() => {
    if (!appointmentId || !userId) {
      return
    }

    // Reset reconnect attempts when creating a new socket
    reconnectAttemptsRef.current = 0

    const newSocket = io(finalSocketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 10000,
      forceNew: true,
    })

    // Connection events
    newSocket.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
      reconnectAttemptsRef.current = 0 // Reset on successful connection

      // Join appropriate room
      if (useChatroom) {
        newSocket.emit("join-chatroom", {
          appointmentId,
          userId,
          role,
        })
      } else {
        newSocket.emit("join-appointment", {
          appointmentId,
          userId,
          role,
        })
      }
    })

    // Handle connection errors
    newSocket.on("connect_error", (error) => {
      reconnectAttemptsRef.current += 1
      console.error("Socket connection error:", error.message)
      setIsConnected(false)

      // Only show error toast after first few attempts to avoid spam
      if (reconnectAttemptsRef.current === 1) {
        console.warn(
          `WebSocket connection failed. Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
        )
      }

      // After max attempts, disable reconnection and show error
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.error(
          `Failed to connect after ${maxReconnectAttempts} attempts. Please check if the server is running at ${finalSocketUrl}`
        )
        newSocket.disconnect()
        toastErrorRef.current(
          "Unable to connect to chat server. Please refresh the page or check your connection."
        )
      }
    })

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
      setIsConnected(false)

      // If disconnected due to transport close, don't show error (user might have closed tab)
      if (reason === "io server disconnect") {
        // Server disconnected, don't try to reconnect
        newSocket.disconnect()
      }
    })

    newSocket.on("connected", (data) => {
      console.log("Joined chat room:", data)
    })

    // Message events
    newSocket.on("new-message", (message: ChatMessage) => {
      // Check if we've recently processed this message ID
      if (recentMessageIdsRef.current.has(message.id)) {
        return
      }

      setMessages((prev) => {
        // Avoid duplicates by checking message ID first (most reliable)
        const existsById = prev.find((m) => m.id === message.id)
        if (existsById) {
          return prev
        }

        // Also check for duplicates by content, sender, and appointment (in case server creates duplicate IDs)
        // Use a more lenient time window (5 seconds) to catch duplicates
        const existsByContent = prev.find(
          (m) =>
            m.content === message.content &&
            m.appointmentId === message.appointmentId &&
            m.sender.id === message.sender.id &&
            m.messageType === message.messageType &&
            Math.abs(
              new Date(m.createdAt).getTime() -
                new Date(message.createdAt).getTime()
            ) < 5000 // Within 5 seconds
        )
        if (existsByContent) {
          return prev
        }

        // Mark this message ID as recently processed
        recentMessageIdsRef.current.add(message.id)

        // Clean up old IDs after 10 seconds to prevent memory leak
        setTimeout(() => {
          recentMessageIdsRef.current.delete(message.id)
        }, 10000)

        // Reset sending state if this is a message we just sent
        // Check if this message matches a pending send (same content and recent)
        const matchingPending = Array.from(pendingSendsRef.current).find(
          (key) => {
            const parts = key.split("|")
            const [prevContent] = parts
            const timestamp = parseInt(parts[2] || "0")
            return (
              prevContent === message.content && Date.now() - timestamp < 5000
            )
          }
        )
        if (matchingPending) {
          pendingSendsRef.current.delete(matchingPending)
          setIsSending(false)
        }

        // Insert message in chronological order
        const newMessages = [...prev, message].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        return newMessages
      })
    })

    // Typing events
    newSocket.on(
      "user-typing",
      (data: { userId: string; isTyping: boolean; timestamp: string }) => {
        if (data.userId !== userId) {
          setTypingUsers((prev) => new Set(prev).add(data.userId))
        }
      }
    )

    newSocket.on(
      "user-stopped-typing",
      (data: { userId: string; isTyping: boolean; timestamp: string }) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          return newSet
        })
      }
    )

    // Online users
    newSocket.on(
      "online-users",
      (data: {
        users: Array<{
          userId: string
          name: string
          role: string | null
          lastSeen: string
        }>
      }) => {
        setOnlineUsers(data.users)
      }
    )

    // User join/leave events
    newSocket.on(
      "user-joined",
      (data: { userId: string; role: string; timestamp: string }) => {
        console.log("User joined:", data)
      }
    )

    newSocket.on("user-left", (data: { userId: string; timestamp: string }) => {
      console.log("User left:", data)
    })

    // Messages read events
    newSocket.on(
      "messages-read",
      (data: { messageIds: string[]; readBy: string; timestamp: string }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            data.messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
          )
        )
      }
    )

    newSocket.on(
      "chatroom-read",
      (_data: { readBy: string; timestamp: string }) => {
        // Mark all messages as read when chatroom is marked as read
        setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })))
      }
    )

    // Error handling
    newSocket.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message)

      // Handle specific errors
      if (error.message.includes("Only doctors can send messages")) {
        toastError(
          "Only doctors can send messages. Patients can only view messages."
        )
      } else if (error.message.includes("Access denied")) {
        toastError("You do not have access to this appointment.")
      } else if (error.message.includes("Chat is not active")) {
        toastError("This chat is no longer active.")
      } else {
        toastError(error.message || "An error occurred")
      }
    })

    setSocket(newSocket)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      // Clear recent message IDs when cleaning up
      recentMessageIdsRef.current.clear()
      // Remove all event listeners to prevent duplicates
      newSocket.off("connect")
      newSocket.off("disconnect")
      newSocket.off("connect_error")
      newSocket.off("connected")
      newSocket.off("new-message")
      newSocket.off("user-typing")
      newSocket.off("user-stopped-typing")
      newSocket.off("online-users")
      newSocket.off("user-joined")
      newSocket.off("user-left")
      newSocket.off("messages-read")
      newSocket.off("chatroom-read")
      newSocket.off("error")
      // Disconnect socket properly
      if (newSocket.connected) {
        newSocket.disconnect()
      } else {
        newSocket.close()
      }
    }
    // toastError is intentionally excluded from dependencies to prevent infinite re-renders
    // It's accessed via toastErrorRef.current instead
  }, [appointmentId, userId, role, finalSocketUrl, useChatroom])

  const sendMessage = useCallback(
    (content: string, messageType: "TEXT" | "IMAGE" | "FILE" = "TEXT") => {
      if (!socket || !isConnected) {
        console.error("Socket not connected")
        toastError("Not connected to chat. Please wait...")
        return
      }

      // Check if user is doctor (only doctors can send)
      if (role !== "doctor") {
        toastError("Only doctors can send messages")
        return
      }

      // Use ref for synchronous check (state is async)
      if (isSendingRef.current) {
        console.log("Already sending a message, please wait...")
        return
      }

      // Create a key for this message to prevent duplicates (content + type)
      const messageKey = `${content}-${messageType}`
      const now = Date.now()

      // Check if we're already sending this exact message (within last 2 seconds)
      const recentKey = Array.from(pendingSendsRef.current).find((key) => {
        const parts = key.split("|")
        const [prevContent, prevType, timestamp] = parts
        return (
          prevContent === content &&
          prevType === messageType &&
          now - parseInt(timestamp || "0") < 2000
        )
      })

      if (recentKey) {
        console.log("Preventing duplicate send:", content)
        return
      }

      // Mark as sending immediately (synchronous)
      isSendingRef.current = true
      setIsSending(true)
      pendingSendsRef.current.add(`${messageKey}|${now}`)

      // Emit the message
      console.log("Sending message:", content)
      socket.emit("send-message", {
        content,
        messageType,
      })

      // Remove from pending after 3 seconds
      setTimeout(() => {
        pendingSendsRef.current.delete(`${messageKey}|${now}`)
        isSendingRef.current = false
        setIsSending(false)
      }, 3000)
    },
    [socket, isConnected, role, toastError]
  )

  const sendFile = useCallback(
    (
      fileUrl: string,
      fileName: string,
      fileSize: number,
      messageType: "IMAGE" | "FILE"
    ) => {
      if (!socket || !isConnected) {
        console.error("Socket not connected")
        toastError("Not connected to chat. Please wait...")
        return
      }

      if (role !== "doctor") {
        toastError("Only doctors can send messages")
        return
      }

      // Create a key for this file message to prevent duplicates
      const messageKey = `${fileUrl}-${messageType}`
      const now = Date.now()

      // Check if we're already sending this exact file (within last 2 seconds)
      const recentKey = Array.from(pendingSendsRef.current).find((key) => {
        const parts = key.split("|")
        const [prevFileUrl, prevType, timestamp] = parts
        return (
          prevFileUrl === fileUrl &&
          prevType === messageType &&
          now - parseInt(timestamp || "0") < 2000
        )
      })

      if (recentKey) {
        console.log("Preventing duplicate file send:", fileName)
        return
      }

      // Use ref for synchronous check (state is async)
      if (isSendingRef.current) {
        console.log("Already sending a message, please wait...")
        return
      }

      // Mark as sending immediately (synchronous)
      isSendingRef.current = true
      setIsSending(true)
      pendingSendsRef.current.add(`${messageKey}|${now}`)

      // Emit the message
      socket.emit("send-message", {
        fileUrl,
        fileName,
        fileSize,
        messageType,
      })

      // Remove from pending after 3 seconds
      setTimeout(() => {
        pendingSendsRef.current.delete(`${messageKey}|${now}`)
        isSendingRef.current = false
        setIsSending(false)
      }, 3000)
    },
    [socket, isConnected, role, toastError]
  )

  const stopTyping = useCallback(() => {
    if (socket && isConnected && role === "doctor") {
      socket.emit("typing-stop")

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
  }, [socket, isConnected, role])

  const startTyping = useCallback(() => {
    if (socket && isConnected && role === "doctor") {
      socket.emit("typing-start")

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Auto stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping()
      }, 3000)
    }
  }, [socket, isConnected, role, stopTyping])

  const markAsRead = useCallback(
    (messageIds?: string[]) => {
      if (socket && isConnected) {
        if (useChatroom) {
          // Chatroom mode: marks all unread messages as read
          socket.emit("mark-read")
        } else {
          // Appointment mode: marks specific messages as read
          socket.emit("mark-read", { messageIds: messageIds || [] })
        }
      }
    },
    [socket, isConnected, useChatroom]
  )

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!appointmentId) return

    setIsLoadingMessages(true)
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_APP_URL}/api/appointments/${appointmentId}/messages`,
        {
          credentials: "include",
        }
      )

      if (response.ok) {
        const data = await response.json()
        // Handle both response structures: data.data.messages or data.data (direct array)
        const messagesArray =
          data.data?.messages && Array.isArray(data.data.messages)
            ? data.data.messages
            : Array.isArray(data.data)
              ? data.data
              : null

        if (messagesArray && messagesArray.length > 0) {
          // Merge with existing messages to avoid duplicates
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id))
            // Also create a set for content-based deduplication
            const existingContentKeys = new Set(
              prev.map(
                (m) =>
                  `${m.id}-${m.content}-${m.appointmentId}-${m.sender.id}-${new Date(m.createdAt).getTime()}`
              )
            )

            const newMessages = messagesArray.filter((m: ChatMessage) => {
              // Check by ID first
              if (existingIds.has(m.id)) {
                return false
              }
              // Check by content key
              const contentKey = `${m.id}-${m.content}-${m.appointmentId}-${m.sender.id}-${new Date(m.createdAt).getTime()}`
              if (existingContentKeys.has(contentKey)) {
                return false
              }
              return true
            })

            if (newMessages.length === 0) {
              // No new messages, return previous state
              return prev
            }

            // Combine and sort chronologically
            const combined = [...prev, ...newMessages].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            return combined
          })
        } else if (messagesArray && messagesArray.length === 0) {
          // If API returns empty array, clear messages to show "No messages yet"
          setMessages([])
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoadingMessages(false)
    }
  }, [appointmentId])

  // Track the last appointmentId we fetched for
  const lastFetchedAppointmentRef = useRef<string | null>(null)

  useEffect(() => {
    // Only fetch if:
    // 1. We have an appointmentId
    // 2. We're connected
    // 3. We haven't fetched for this appointment yet (or appointmentId changed)
    if (
      appointmentId &&
      isConnected &&
      lastFetchedAppointmentRef.current !== appointmentId
    ) {
      lastFetchedAppointmentRef.current = appointmentId
      fetchMessages()
    }
  }, [appointmentId, isConnected, fetchMessages])

  return {
    socket,
    messages,
    isConnected,
    isLoadingMessages,
    typingUsers,
    onlineUsers,
    sendMessage,
    sendFile,
    startTyping,
    stopTyping,
    markAsRead,
    fetchMessages,
    isSending,
  }
}
