"use client"

import { ArrowLeft } from "lucide-react"
import { useState } from "react"
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
import ManageAccount from "./_components/manage-account"
import PrivacySettings from "./_components/privacy-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showTabContent, setShowTabContent] = useState(false)

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
      case "medical":
        return "Medical Info"
      case "privacy":
        return "Privacy Settings"
      case "password":
        return "Change Password"
      case "account":
        return "Manage Account"
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
                value="privacy"
                className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                onClick={() => handleTabClick("privacy")}
              >
                Privacy Settings
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                onClick={() => handleTabClick("password")}
              >
                Change Password
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                onClick={() => handleTabClick("account")}
              >
                Manage Account
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content - Hidden on mobile when tabs are shown */}
        <div className={cn("flex-1", !showTabContent && "hidden lg:block")}>
          {/* Mobile Header */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
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
            <TabsContent value="privacy">
              <PrivacySettings />
            </TabsContent>
            <TabsContent value="password">
              <ChangePassword />
            </TabsContent>
            <TabsContent value="account">
              <div className="p-6 bg-background rounded-lg">
                <ManageAccount />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
