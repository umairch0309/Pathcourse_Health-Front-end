"use client"

import { ArrowLeft, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-modified"
import { ChangePassword } from "./_components/change-password"
import ProfileSettings from "./_components/profile-settings"
import RolesPermissions from "./_components/roles-permissions"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import auth from "@/lib/auth"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showTabContent, setShowTabContent] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const { permissions } = useUserPermissions(userId)

  // Check if user is main admin (has "*" permission)
  const isMainAdmin = permissions.includes("*")

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user?.id) {
          setUserId(session.data.user.id)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    fetchSession()
  }, [])

  const handleTabClick = (value: string) => {
    setActiveTab(value)
    setShowTabContent(true)
  }

  const handleBackToTabs = () => {
    setShowTabContent(false)
  }

  const getTabTitle = (value: string) => {
    switch (value) {
      case "profile":
        return "Profile Settings"
      case "password":
        return "Change Password"
      case "roles":
        return "Roles and Permissions"
      default:
        return "Settings"
    }
  }

  return (
    <div className="w-full">
      <Typography variant="h5" className="p-1 text-foreground font-bold">
        Settings
      </Typography>

      <div className="flex gap-2">
        {/* Tab List - Hidden on mobile when content is shown */}
        <div
          className={cn(
            "w-full lg:w-[400px] p-6 bg-background rounded-lg shadow shadow-lg border border-border",
            showTabContent && "hidden lg:block"
          )}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
          >
            <TabsList className="flex flex-col space-y-4">
              <TabsTrigger
                value="profile"
                className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                onClick={() => handleTabClick("profile")}
              >
                Profile Settings
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                onClick={() => handleTabClick("password")}
              >
                Change Password
              </TabsTrigger>
              {isMainAdmin && !isLoadingUser && (
                <TabsTrigger
                  value="roles"
                  className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                  onClick={() => handleTabClick("roles")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Roles and Permissions
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content - Hidden on mobile when tabs are shown */}
        <div className={cn("flex-1", !showTabContent && "hidden lg:block")}>
          {/* Mobile Header */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center gap-3 p-4 bg-background shadow shadow-lg rounded-lg">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleBackToTabs}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Typography variant="p" className="font-bold text-foreground">
                {getTabTitle(activeTab)}
              </Typography>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
          >
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="password">
              <ChangePassword />
            </TabsContent>
            {isMainAdmin && !isLoadingUser && (
              <TabsContent value="roles">
                <RolesPermissions />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
