"use client"

type AgoraLoadingStateProps = {
  width?: string | number
  height?: string | number
  className?: string
  theme?: {
    background?: string
    text?: string
  }
}

export function AgoraLoadingState({
  width = "100%",
  height = "100vh",
  className = "",
  theme = {
    background: "bg-white",
    text: "text-gray-800",
  },
}: AgoraLoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center ${theme.background} ${className}`}
      style={{ width, height }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex space-x-2">
          <span className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"></span>
        </div>
        <p className={`text-lg font-medium ${theme.text}`}>
          Connecting to your video consultation...
        </p>
      </div>
    </div>
  )
}
