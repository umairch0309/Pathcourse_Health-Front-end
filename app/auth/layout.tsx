"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import EnterpriseAccessModal from "../(public)/enterprise-access-modal"

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const useResetImage = [
    "/auth/reset-password",
    "/auth/verify-email",
    "/auth/new-password",
  ].includes(pathname)

  return (
    <div className="relative flex flex-col h-screen">
      <EnterpriseAccessModal />
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={32}
            priority
            className="w-16 h-8 sm:w-20 sm:h-10"
          />
        </Link>
      </div>

      <div className="flex flex-1">
        <div className="w-full lg:w-1/2 flex flex-col h-full z-10 relative">
          <div className="flex-1 flex items-center justify-center overflow-auto px-4 py-10 sm:px-8">
            {children}
          </div>
        </div>

        <div className="hidden lg:block w-1/2 h-full relative">
          <Image
            src={useResetImage ? "/reset.jpg" : "/auth.jpg"}
            alt="Auth Background"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
