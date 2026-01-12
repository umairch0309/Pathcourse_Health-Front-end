import toast from "react-hot-toast"

const useToast = () => {
  const toastSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#10b981",
        color: "#ffffff",
        padding: "16px 20px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow:
          "0 10px 25px -5px rgba(16, 185, 129, 0.3), 0 8px 10px -6px rgba(16, 185, 129, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        maxWidth: "400px",
      },
      iconTheme: {
        primary: "#ffffff",
        secondary: "#10b981",
      },
    })
  }
  const toastError = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#ef4444",
        color: "#ffffff",
        padding: "16px 20px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow:
          "0 10px 25px -5px rgba(239, 68, 68, 0.3), 0 8px 10px -6px rgba(239, 68, 68, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        maxWidth: "400px",
      },
      iconTheme: {
        primary: "#ffffff",
        secondary: "#ef4444",
      },
    })
  }
  return {
    toastError,
    toastSuccess,
  }
}

export default useToast
