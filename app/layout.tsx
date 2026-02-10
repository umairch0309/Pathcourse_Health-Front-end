import type { Metadata } from "next"
import { Geist_Mono, Raleway } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import Provider from "@/provider"
import "./globals.css"

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Path Course Health",
  description:
    "Path Course Health is a platform for healthcare professionals and patients to connect and manage their healthcare sessions.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${geistMono.variable} antialiased font-sans`}
    >
      <body>
        <NuqsAdapter>
          <Provider>{children}</Provider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
