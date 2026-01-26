"use client"

import axios from "axios"
import {
  AlertTriangle,
  CheckCircle,
  File,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { env } from "@/env"
import useApi from "@/hooks/use-api"
import {
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload"
import { buildRequestUrl, cn } from "@/lib/utils"

// File type definitions
export type FileType = "images" | "documents" | "videos" | "all"

interface S3FileUploadProps {
  onSuccess?: (keys: string | string[]) => void // Return key(s) directly
  onDelete?: (key: string) => void // Pass key for deletion
  value?: string | string[] // Initial value as key(s) - can be keys or URLs for backward compatibility
  singleItem?: boolean
  fileType?: FileType
  maxSize?: number // in bytes
  className?: string
  disabled?: boolean
  placeholder?: string
  baseUrl?: string // Base URL for constructing full URLs from keys
}

export interface UploadedFile {
  key: string // S3 key for database storage
  url: string // Full URL for preview (from fileUrl in response or constructed)
  name: string
  size: number
  type: string
  fileUrl?: string // Optional: actual file URL from upload response
}

// File type configurations
const FILE_TYPE_CONFIG = {
  images: {
    accept: "image/*",
    description: "PNG, JPG, GIF, WEBP",
    icon: ImageIcon,
  },
  documents: {
    accept: ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx",
    description: "PDF, DOC, XLS, PPT",
    icon: File,
  },
  videos: {
    accept: "video/*",
    description: "MP4, MOV, AVI, WEBM",
    icon: Video,
  },
  all: {
    accept: "*",
    description: "Any file type",
    icon: File,
  },
}

// Helper functions
function isUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function extractFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const segments = pathname.split("/")
    const fileName = segments[segments.length - 1]

    // If filename has encoded characters, decode them
    return decodeURIComponent(fileName) || "Unknown file"
  } catch {
    // If URL parsing fails, try to extract from the end of the string
    const segments = url.split("/")
    return segments[segments.length - 1] || "Unknown file"
  }
}

// Helper function to truncate filename for display
function truncateFileName(fileName: string, maxLength: number = 30): string {
  if (fileName.length <= maxLength) return fileName
  const extension = fileName.split(".").pop()
  const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf("."))
  const truncatedName = nameWithoutExt.slice(
    0,
    maxLength - extension!.length - 4
  ) // -4 for "..."
  return `${truncatedName}...${extension}`
}

function getFileTypeFromUrl(url: string): string {
  const fileName = extractFileNameFromUrl(url)
  const extension = fileName.split(".").pop()?.toLowerCase()

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"]
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
  ]

  if (extension && imageExtensions.includes(extension)) {
    return `image/${extension === "jpg" ? "jpeg" : extension}`
  }

  if (extension && documentExtensions.includes(extension)) {
    if (extension === "doc" || extension === "docx") {
      return "application/msword"
    }
    if (extension === "pdf") {
      return "application/pdf"
    }
    if (extension === "txt") {
      return "text/plain"
    }
    // Add more MIME types as needed
  }

  return "application/octet-stream"
}

export default function S3FileUpload({
  onSuccess,
  onDelete,
  value,
  singleItem = false,
  fileType = "all",
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  disabled = false,
  placeholder,
  baseUrl,
}: S3FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  // State for signed preview URLs
  const [signedPreviewUrls, setSignedPreviewUrls] = useState<
    Record<string, string>
  >({})
  // Ref to track which keys we're currently fetching to avoid duplicate requests
  const fetchingRef = useRef<Set<string>>(new Set())
  // Ref to track which keys we've already fetched (to avoid re-fetching)
  const fetchedKeysRef = useRef<Set<string>>(new Set())

  const config = FILE_TYPE_CONFIG[fileType]
  const IconComponent = config.icon

  // API hook for getting signed URLs for preview
  // Using direct axios call because useApi expects response.data.data structure
  // but our API might return it directly in response.data
  const [isGettingSignedUrl, setIsGettingSignedUrl] = useState(false)

  const getSignedUrlForPreview = useCallback(
    async (params: {
      path: string
      data: { key: string; expiresIn?: number }
      onSuccess: (data: unknown) => void
      onError?: (error: unknown) => void
    }) => {
      setIsGettingSignedUrl(true)
      try {
        const REQUEST_PATH = buildRequestUrl(
          env.NEXT_PUBLIC_APP_URL,
          params.path
        )
        const response = await axios.post(REQUEST_PATH, params.data, {
          withCredentials: true,
        })

        console.log("=== Raw Axios Response ===")
        console.log("response.data:", response.data)
        console.log("response.data.data:", response.data?.data)

        // Try response.data.data first (useApi format), fallback to response.data
        const result = response.data?.data || response.data

        console.log("Extracted result:", result)
        params.onSuccess(result)
      } catch (error) {
        console.error("Axios error:", error)
        params.onError?.(error)
      } finally {
        setIsGettingSignedUrl(false)
      }
    },
    []
  )

  // Helper to extract S3 key from URL or key
  const extractS3Key = useCallback((keyOrUrl: string): string => {
    if (isUrl(keyOrUrl)) {
      try {
        const urlObj = new URL(keyOrUrl)
        const pathname = urlObj.pathname
        const parts = pathname.split("/").filter(Boolean)
        if (parts[0] === "pathcourse") {
          parts.shift()
        }
        return parts.join("/")
      } catch {
        return keyOrUrl
      }
    }
    return keyOrUrl
  }, [])

  // Fetch signed URL for preview
  const fetchSignedPreviewUrl = useCallback(
    (key: string) => {
      // Don't fetch if we're currently fetching or already fetched this key
      if (fetchingRef.current.has(key) || fetchedKeysRef.current.has(key)) {
        return
      }

      // Mark as fetching
      fetchingRef.current.add(key)

      const s3Key = extractS3Key(key)

      // Fetch signed URL
      getSignedUrlForPreview({
        path: "/api/signed-url",
        data: {
          key: s3Key,
          expiresIn: 3600, // 1 hour
        },
        onSuccess: (response: unknown) => {
          console.log("=== Signed URL Response Debug ===")
          console.log("Raw response type:", typeof response)
          console.log("Raw response:", response)
          console.log("Is object:", typeof response === "object")
          console.log(
            "Response keys:",
            response && typeof response === "object"
              ? Object.keys(response)
              : "N/A"
          )

          // Handle response structure
          // useApi hook unwraps: onSuccess(response.data.data)
          // So if API returns { message: "...", data: { signedUrl: "..." } }
          // Then useApi passes response.data.data which is { signedUrl: "..." }
          // BUT if response.data.data is undefined, it means the structure might be different

          let signedUrlValue: string | undefined

          if (response === undefined || response === null) {
            console.error(
              "Response is undefined/null - this means useApi received undefined from response.data.data"
            )
            console.error(
              "This suggests the API response structure doesn't match what useApi expects"
            )
            console.error(
              "useApi expects: { message: string, data: { signedUrl, ... } }"
            )
            console.error("But got: response.data.data is undefined")
            fetchingRef.current.delete(key)
            fetchedKeysRef.current.add(key)
            return
          }

          // Try different response structures
          if (typeof response === "object") {
            const resp = response as Record<string, unknown>

            // Try direct access first (if useApi passed the data object directly)
            if (typeof resp.signedUrl === "string") {
              signedUrlValue = resp.signedUrl
            }
            // Try nested in data (if somehow double-wrapped)
            else if (resp.data && typeof resp.data === "object") {
              const dataObj = resp.data as Record<string, unknown>
              if (typeof dataObj.signedUrl === "string") {
                signedUrlValue = dataObj.signedUrl
              }
            }
          }

          if (signedUrlValue) {
            console.log("✅ Found signed URL:", signedUrlValue)
            setSignedPreviewUrls((prevState) => {
              // Double-check we don't already have it (race condition protection)
              if (prevState[key]) {
                return prevState
              }
              return {
                ...prevState,
                [key]: signedUrlValue,
              }
            })
            fetchedKeysRef.current.add(key)
          } else {
            console.warn(
              "❌ Signed URL not found. Full response:",
              JSON.stringify(response, null, 2)
            )
            fetchedKeysRef.current.add(key) // Mark as fetched even on error to prevent retries
          }
          fetchingRef.current.delete(key)
        },
        onError: (error: any) => {
          console.error("❌ Failed to get signed URL for preview:", error)
          console.error("Error response:", error?.response)
          console.error("Error data:", error?.response?.data)
          fetchingRef.current.delete(key)
          fetchedKeysRef.current.add(key) // Mark as fetched to prevent infinite retries
          // Fallback to direct URL
        },
      })
    },
    [getSignedUrlForPreview, extractS3Key]
  )

  // Convert key(s) or URL(s) to UploadedFile format for internal state
  useEffect(() => {
    if (value) {
      const files: UploadedFile[] = []

      if (singleItem && typeof value === "string" && value.trim()) {
        const fileName = isUrl(value)
          ? extractFileNameFromUrl(value)
          : value.split("/").pop() || "file"

        // If value is a full URL, use it directly for preview
        // Otherwise, it's a key and we need to construct the S3 URL
        let displayUrl: string
        if (isUrl(value)) {
          displayUrl = value
        } else if (baseUrl) {
          // Use provided baseUrl
          displayUrl = baseUrl.endsWith("/")
            ? `${baseUrl}${value}`
            : `${baseUrl}/${value}`
        } else {
          // For keys from database, construct S3 URL directly
          displayUrl = `https://s3.eu-north-1.amazonaws.com/pathcourse/${value}`
        }

        // Determine file type - if fileType prop is "images", use image type, otherwise detect from URL
        let fileTypeFromUrl = getFileTypeFromUrl(displayUrl)
        if (fileType === "images" && !fileTypeFromUrl.startsWith("image/")) {
          // If fileType is "images" but detection failed, default to image
          fileTypeFromUrl = "image/jpeg"
        }

        const file: UploadedFile = {
          key: value, // Store the key as-is
          url: displayUrl, // Full S3 URL for preview (fallback)
          name: fileName,
          size: 0, // Unknown size for existing files
          type: fileTypeFromUrl,
        }

        files.push(file)
      } else if (!singleItem && Array.isArray(value)) {
        value.forEach((keyOrUrl: string) => {
          if (typeof keyOrUrl === "string" && keyOrUrl.trim()) {
            const fileName = isUrl(keyOrUrl)
              ? extractFileNameFromUrl(keyOrUrl)
              : keyOrUrl.split("/").pop() || "file"

            // If value is a full URL, use it directly for preview
            // Otherwise, it's a key and we need to construct the S3 URL
            let displayUrl: string
            if (isUrl(keyOrUrl)) {
              displayUrl = keyOrUrl
            } else if (baseUrl) {
              // Use provided baseUrl
              displayUrl = baseUrl.endsWith("/")
                ? `${baseUrl}${keyOrUrl}`
                : `${baseUrl}/${keyOrUrl}`
            } else {
              // For keys from database, construct S3 URL directly
              displayUrl = `https://s3.eu-north-1.amazonaws.com/pathcourse/${keyOrUrl}`
            }

            // Determine file type - if fileType prop is "images", use image type, otherwise detect from URL
            let fileTypeFromUrl = getFileTypeFromUrl(displayUrl)
            if (
              fileType === "images" &&
              !fileTypeFromUrl.startsWith("image/")
            ) {
              // If fileType is "images" but detection failed, default to image
              fileTypeFromUrl = "image/jpeg"
            }

            const file: UploadedFile = {
              key: keyOrUrl, // Store the key as-is
              url: displayUrl, // Full S3 URL for preview (fallback)
              name: fileName,
              size: 0,
              type: fileTypeFromUrl,
            }

            files.push(file)
          }
        })
      }

      setUploadedFiles(files)
    } else {
      setUploadedFiles([])
      // Reset refs when value is cleared
      fetchingRef.current.clear()
      fetchedKeysRef.current.clear()
    }
  }, [value, singleItem, baseUrl, fileType])

  // Separate useEffect to fetch signed URLs for files that need them
  useEffect(() => {
    uploadedFiles.forEach((file) => {
      // Only fetch for keys (not full URLs) and if not already fetched
      if (
        !isUrl(file.key) &&
        !fetchedKeysRef.current.has(file.key) &&
        !fetchingRef.current.has(file.key)
      ) {
        fetchSignedPreviewUrl(file.key)
      }
    })
  }, [uploadedFiles, fetchSignedPreviewUrl])

  // API hook for getting signed URLs
  const { onRequest: getSignedUrl, isPending: isGettingUrl } = useApi<{
    fileName: string
    fileType: string
    directory?: string
  }>({
    showSuccessToast: false,
    showErrorToast: true,
    method: "post", // Explicitly specify POST method
  })

  // API hook for deleting files
  const { onRequest: deleteFiles, isPending: isDeleting } = useApi<{
    fileUrls: string[]
  }>({
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const [
    { files, isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: singleItem ? 1 : 10,
    maxSize,
    accept: config.accept,
    multiple: !singleItem,
    onFilesAdded: handleFilesAdded,
  })

  // Upload file to S3 using signed URL (simple fetch approach)
  const uploadToS3 = async (
    file: File,
    uploadUrl: string,
    key: string,
    fileUrl: string
  ): Promise<UploadedFile> => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`)
    }

    // Use fileUrl for preview (which comes from uploadUrl in the response)
    return {
      key,
      url: fileUrl, // Use fileUrl which is the preview URL (uploadUrl from response)
      name: file.name,
      size: file.size,
      type: file.type,
      fileUrl: fileUrl,
    }
  }

  // Handle file addition and start upload process
  async function handleFilesAdded(addedFiles: FileWithPreview[]) {
    if (disabled || isUploading) return

    setIsUploading(true)
    const results: UploadedFile[] = []

    try {
      // Process files one by one to avoid overwhelming the server
      for (const fileItem of addedFiles) {
        const file = fileItem.file as File

        // Get signed URL from server
        getSignedUrl({
          path: "/api/upload-url",
          data: {
            fileName: file.name,
            fileType: file.type,
            directory: "uploads", // Optional: specify directory
          },
          onSuccess: async (response: {
            uploadUrl: string // Signed URL for uploading (PUT) - has x-id=PutObject
            key: string // S3 key to store in database
            fileUrl: string // Signed URL for preview (GET) - has x-id=GetObject
            expiresAt: string
          }) => {
            console.log("Upload URL response:", response)
            try {
              const uploadedFile = await uploadToS3(
                file,
                response.uploadUrl, // Use uploadUrl to upload to S3 (signed PUT URL with x-id=PutObject)
                response.key, // Store this in database
                response.fileUrl // Use fileUrl for preview (signed GET URL with x-id=GetObject)
              )

              results.push(uploadedFile)

              // If this is the last file, update state and call callbacks
              if (results.length === addedFiles.length) {
                setUploadedFiles((prev) =>
                  singleItem ? results : [...prev, ...results]
                )

                // Pass keys to onSuccess (store keys in database, not URLs)
                const keys = results.map((file) => file.key)
                console.log("S3FileUpload: Calling onSuccess with keys:", keys)
                onSuccess?.(singleItem ? keys[0] : keys)

                clearFiles()
                setIsUploading(false)
              }
            } catch (error) {
              console.error("Upload to S3 failed:", error)
              setIsUploading(false)
            }
          },
          onError: (error) => {
            console.error("Failed to get signed URL:", error)
            setIsUploading(false)
          },
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setIsUploading(false)
    }
  }

  // Handle file deletion
  const handleDeleteFile = useCallback(
    (fileKey: string) => {
      // Delete from S3 using the API - pass key instead of URL
      deleteFiles({
        path: "/api/delete",
        data: {
          fileUrls: [fileKey], // API accepts S3 keys
        },
        onSuccess: () => {
          setUploadedFiles((prev) =>
            prev.filter((file) => file.key !== fileKey)
          )
          // Pass the key instead of URL
          onDelete?.(fileKey)
        },
        onError: (error) => {
          console.error("Failed to delete file:", error)
          // Still remove from local state even if S3 deletion fails
          setUploadedFiles((prev) =>
            prev.filter((file) => file.key !== fileKey)
          )
          // Pass the key instead of URL
          onDelete?.(fileKey)
        },
      })
    },
    [onDelete, deleteFiles]
  )

  // Handle bulk file deletion
  const handleDeleteAllFiles = useCallback(() => {
    const fileKeys = uploadedFiles.map((file) => file.key).filter(Boolean)

    if (fileKeys.length > 0) {
      deleteFiles({
        path: "/api/files/delete",
        data: {
          fileUrls: fileKeys, // API accepts S3 keys
        },
        onSuccess: () => {
          const deletedKeys = uploadedFiles.map((file) => file.key)
          setUploadedFiles([])
          deletedKeys.forEach((key) => {
            onDelete?.(key)
          })
        },
        onError: (error) => {
          console.error("Failed to delete files:", error)
          // Still clear local state even if S3 deletion fails
          const deletedKeys = uploadedFiles.map((file) => file.key)
          setUploadedFiles([])
          deletedKeys.forEach((key) => {
            onDelete?.(key)
          })
        },
      })
    }
  }, [uploadedFiles, onDelete, deleteFiles])

  // Check if upload is disabled
  const isUploadDisabled =
    disabled ||
    isUploading ||
    isGettingUrl ||
    isDeleting ||
    (singleItem && uploadedFiles.length > 0)

  // Check if file is an image
  const isImage = (file: UploadedFile): boolean => {
    return file.type.startsWith("image/")
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Show uploaded files first if they exist */}
      {uploadedFiles.length > 0 && (
        <div
          className={cn(
            "space-y-3",
            fileType === "images" &&
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {uploadedFiles.map((file) => {
            // Calculate preview URL inside map to ensure it updates when signedPreviewUrls changes
            const previewUrl =
              signedPreviewUrls[file.key] || file.fileUrl || file.url
            // For fileType="images", always use image layout, otherwise check file type
            const isImageFile = fileType === "images" || isImage(file)

            if (isImageFile) {
              // Image Preview Card
              return (
                <div
                  key={file.key}
                  className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {isGettingSignedUrl &&
                    !signedPreviewUrls[file.key] &&
                    !file.fileUrl ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <img
                        key={previewUrl} // Force re-render when URL changes
                        src={previewUrl}
                        alt={file.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          console.error("Failed to load image:", previewUrl)
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex h-full w-full items-center justify-center bg-muted">
                                <svg class="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            `
                          }
                        }}
                      />
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <div className="rounded-full bg-green-500/90 p-1.5 shadow-sm">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Delete Button - Always visible */}
                    <Button
                      onClick={() => handleDeleteFile(file.key)}
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="absolute top-2 left-2 z-10 h-8 w-8 rounded-full bg-red-500/90 text-white hover:bg-red-600 shadow-md"
                      disabled={isDeleting}
                      title="Delete image"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Image Info */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="min-w-0 flex-1 max-w-[calc(100%-3rem)]">
                      <p
                        className="truncate text-sm font-medium"
                        title={file.name}
                      >
                        {truncateFileName(file.name, 30)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.size > 0 ? formatBytes(file.size) : "Uploaded"}
                      </p>
                    </div>
                    {/* Delete Button in info section as backup */}
                    <Button
                      onClick={() => handleDeleteFile(file.key)}
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="ml-2 h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      disabled={isDeleting}
                      title="Delete image"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )
            } else {
              // Document Preview Card
              // Calculate preview URL for documents too
              const docPreviewUrl =
                signedPreviewUrls[file.key] || file.fileUrl || file.url

              return (
                <div
                  key={file.key}
                  className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-md"
                >
                  {/* Document Icon */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/5">
                    <File className="h-7 w-7 text-primary" />
                  </div>

                  {/* Document Info */}
                  <div className="min-w-0 flex-1 max-w-[calc(100%-4rem)]">
                    <p
                      className="truncate text-sm font-semibold"
                      title={file.name}
                    >
                      {truncateFileName(file.name, 30)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {file.size > 0 ? formatBytes(file.size) : "Uploaded"}
                      </span>
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    </div>
                  </div>

                  {/* View and Delete Buttons */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      onClick={() => window.open(docPreviewUrl, "_blank")}
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="h-9 w-9 rounded-lg"
                      title="View file"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteFile(file.key)}
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive"
                      disabled={isDeleting}
                      title="Delete file"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )
            }
          })}
        </div>
      )}

      {/* Dropzone - Only show if no file uploaded (for singleItem) or always (for multiple) */}
      {(!singleItem || uploadedFiles.length === 0) && (
        <button
          type="button"
          className={cn(
            "relative w-full border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
            isDragging && !isUploadDisabled
              ? "border-primary bg-primary/5 scale-[1.01] shadow-lg"
              : fileType === "images"
                ? "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
                : "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50",
            isUploadDisabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={!isUploadDisabled ? openFileDialog : undefined}
          onDragEnter={!isUploadDisabled ? handleDragEnter : undefined}
          onDragLeave={!isUploadDisabled ? handleDragLeave : undefined}
          onDragOver={!isUploadDisabled ? handleDragOver : undefined}
          onDrop={!isUploadDisabled ? handleDrop : undefined}
          disabled={isUploadDisabled}
        >
          <input
            {...getInputProps()}
            className="sr-only"
            disabled={isUploadDisabled}
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full transition-all",
                isDragging && !isUploadDisabled
                  ? "bg-primary text-primary-foreground scale-110"
                  : fileType === "images"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {isUploading || isGettingUrl ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <IconComponent className="h-7 w-7" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-base font-semibold">
                {placeholder ||
                  (singleItem
                    ? `Click to upload ${fileType === "images" ? "image" : "file"}`
                    : `Click to upload ${fileType === "images" ? "images" : "files"}`)}
              </p>
              <p className="text-sm text-muted-foreground">
                {config.description} • Max size {formatBytes(maxSize)}
              </p>
              {!singleItem && fileType === "images" && (
                <p className="text-xs text-muted-foreground/70 mt-1">
                  You can upload multiple images at once
                </p>
              )}
            </div>

            <Button
              type="button"
              variant={fileType === "images" ? "default" : "outline"}
              size="sm"
              className="mt-2"
              disabled={isUploadDisabled}
              onClick={(e) => {
                e.stopPropagation()
                if (!isUploadDisabled) openFileDialog()
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose {fileType === "images" ? "Images" : "Files"}
            </Button>
          </div>
        </button>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errors.map((error, index) => (
              <div key={`error-${index}-${error.slice(0, 10)}`}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Multiple files header (only for multiple file mode) */}
      {!singleItem && uploadedFiles.length > 0 && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">
            Uploaded files ({uploadedFiles.length})
          </h4>
          <Button
            onClick={handleDeleteAllFiles}
            variant="ghost"
            size="sm"
            type="button"
            className="text-muted-foreground hover:text-destructive"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? "Deleting..." : "Remove all"}
          </Button>
        </div>
      )}

      {/* Current Files Being Selected */}
      {files.length > 0 && !isUploading && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Ready to upload ({files.length})
          </h4>
          <div className="grid gap-2">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
              >
                <div className="flex-shrink-0">
                  {fileItem.file.type.startsWith("image/") &&
                  fileItem.preview ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="h-10 w-10 rounded border object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                      <File className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 max-w-[calc(100%-4rem)]">
                  <p
                    className="truncate text-sm font-medium"
                    title={fileItem.file.name}
                  >
                    {truncateFileName(fileItem.file.name, 30)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(fileItem.file.size)}
                  </p>
                </div>
                <Button
                  onClick={() => removeFile(fileItem.id)}
                  variant="ghost"
                  type="button"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
