"use client"

import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-modified"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { ChangePassword } from "./_components/change-password"
import Documents from "./_components/documents"
import EducationalInfo from "./_components/educational-info"
import ManageAccount from "./_components/manage-account"
import ProfessionalExperience from "./_components/professional-experience"
import ProfileSettings from "./_components/profile-settings"

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
      case "educational":
        return "Educational Info"
      case "professional":
        return "Professional Experience"
      case "documents":
        return "Documents"
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
            "w-full lg:w-[400px] p-6 bg-background rounded-lg",
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
                value="educational"
                className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                onClick={() => handleTabClick("educational")}
              >
                Educational Info
              </TabsTrigger>
              <TabsTrigger
                value="professional"
                className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                onClick={() => handleTabClick("professional")}
              >
                Professional Experience
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="w-full justify-start data-[state=active]:border-b data-[state=active]:border-muted-foreground"
                onClick={() => handleTabClick("documents")}
              >
                Documents
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
            <TabsContent value="educational">
              <EducationalInfo />
            </TabsContent>
            <TabsContent value="professional">
              <ProfessionalExperience />
            </TabsContent>
            <TabsContent value="documents">
              <Documents />
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
