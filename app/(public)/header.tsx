"use client"
import { LogOut, Menu, Search, User, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useToast from "@/hooks/use-toast"
import auth from "@/lib/auth"

type AuthUser = {
  id?: string
  name?: string | null
  email?: string | null
  role?: "admin" | "doctor" | "patient"
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setUser(session.data.user as AuthUser)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSession()
  }, [])

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      toastSuccess("Logged out successfully")
      setUser(null)
      setUserDropdownOpen(false)
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("Failed to logout:", error)
      toastError("Failed to logout. Please try again.")
    }
  }

  const getDashboardPath = (role?: string) => {
    switch (role) {
      case "admin":
        return "/admin"
      case "doctor":
        return "/specialist"
      case "patient":
        return "/patient"
      default:
        return "/"
    }
  }

  return (
    <header className="fixed bg-background w-full z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={100}
                height={30}
                className="w-20 sm:w-24 lg:w-[100px] h-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation and Search */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-6 xl:gap-8">
            <nav className="flex items-center space-x-6 xl:space-x-8">
              <Link
                href="/about"
                className="text-foreground hover:text-foreground/90 transition-colors text-sm xl:text-base"
              >
                About
              </Link>
              <Link
                href="/contact-us"
                className="text-foreground hover:text-foreground/90 transition-colors text-sm xl:text-base"
              >
                Contact Us
              </Link>
            </nav>

            {/* Desktop Search */}
            <div className="hidden xl:flex items-center ml-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-32 xl:w-40 rounded-md border-0 focus:ring-0 focus:border-0 shadow-none outline-none text-sm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Tablet Search (hidden on mobile and desktop) */}
            <div className="hidden md:flex lg:hidden xl:hidden items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-40 rounded-md focus:ring-foreground focus:border-foreground text-sm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons - Hidden on Mobile */}
            <div className="hidden sm:flex items-center space-x-3">
              {!isLoading && user ? (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-primary"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  {userDropdownOpen && (
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
                            <Link
                              href={getDashboardPath(user.role)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </Link>
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-primary"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-muted rounded-b-xl shadow-lg">
            <nav className="flex flex-col space-y-4 p-4">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/service"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/contact-us"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                href="/doctors"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Specialists
              </Link>
              {!isLoading && user ? (
                <>
                  <div className="px-2 py-2 border-b border-muted">
                    <p className="text-sm font-semibold text-foreground">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href={getDashboardPath(user.role)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors py-2 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/book-session"
                    className="text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book Session
                  </Link>
                </>
              )}

              {/* Mobile Search */}
              <div className="pt-2 border-t border-muted">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 w-full rounded-md focus:ring-primary focus:border-primary text-sm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
