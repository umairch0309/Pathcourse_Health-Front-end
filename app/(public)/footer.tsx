import { Copyright } from "lucide-react"

export default function Footer() {
  return (
    <div className="bg-secondary py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-background text-sm flex items-center justify-center gap-1">
          <Copyright className="w-4 h-4" />
          Copyrights 2024 Path Course Health, All Rights Reserved
        </p>
      </div>
    </div>
  )
}
