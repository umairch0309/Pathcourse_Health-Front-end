"use client"

import { LogOut, Search, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import useToast from "@/hooks/use-toast"
import auth from "@/lib/auth"
import NotificationsDropdown from "./notification-dropdown"

type AuthUser = {
  id?: string
  name?: string | null
  email?: string | null
}

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setUser(session.data.user)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSession()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      toastSuccess("Logged out successfully")
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("Failed to logout:", error)
      toastError("Failed to logout. Please try again.")
    }
  }

  return (
    <header className="w-full flex justify-between items-center px-4 py-2 bg-background border-b shadow-sm h-[60px] shrink-0 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden text-foreground" />{" "}
        <Link href="/" className="cursor-pointer">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={80}
            className="object-cover"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <Search className="w-6 h-6 text-foreground cursor-pointer" />
        <NotificationsDropdown />

        <div className="relative">
          <User
            className="w-6 h-6 text-foreground cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
              {user && (
                <>
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Button type="button" onClick={handleLogout} variant="link">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
              {!user && !isLoading && (
                <div className="py-1">
                  <Button type="button" onClick={handleLogout} variant="link">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
