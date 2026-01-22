"use client"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-modified"
import ChatWindow from "./conversation"
import Notes from "./notes"
import AppointmentInfo from "./session-ino"
import PatientInfo from "./user-info"

type TabValue = "session" | "user" | "conversations" | "notes"

export type AppointmentForDetails = {
  id: string
  status: "BOOKED" | "COMPLETED" | "NO_SHOW"
  scheduledAt: string
  startedAt: string | null
  endedAt: string | null
  appointmentFor: "self" | "someone else"
  issue: string | null
  age: number | null
  patientName: string | null
  patientAge: number | null
  relationWithPatient: string | null
  uploadId?: string | null
  doctor: {
    id: string
    name: string
    email: string
    image: string | null
    role: string
  }
  patient: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    isAnonymous: boolean
    employeeCode: string | null
    userInfo?: {
      id: string
      userId: string
      gender: string | null
      dateOfBirth: string | null
      phone: string | null
      address: string | null
    } | null
  }
}

const tabsConfig = [
  { value: "session" as TabValue, label: "Session Info" },
  { value: "user" as TabValue, label: "User Info" },
  { value: "conversations" as TabValue, label: "Conversations" },
  { value: "notes" as TabValue, label: "Notes" },
]

type DetailsTabsProps = {
  defaultTab?: TabValue
  appointment: AppointmentForDetails
}

export function DetailsTabs({
  defaultTab = "session",
  appointment,
}: DetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>(defaultTab)
  const showUserTab = !appointment.patient.isAnonymous
  const visibleTabs = showUserTab
    ? tabsConfig
    : tabsConfig.filter((tab) => tab.value !== "user")

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue)
  }

  const getCurrentTabLabel = () => {
    return (
      visibleTabs.find((tab) => tab.value === activeTab)?.label || "session"
    )
  }

  return (
    <div className="w-full space-y-4">
      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex space-y-3 flex-col lg:space-y-0 lg:flex-row lg:justify-between lg:items-center w-full">
          <div className="w-full">
            {/* Mobile Menu - visible on small screens */}
            <div className="lg:hidden bg-transparent">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-9 text-xs sm:text-sm px-3 py-1.5 bg-transparent border-muted-foreground"
                  >
                    <span>{getCurrentTabLabel()}</span>
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {visibleTabs.map((tab) => (
                    <DropdownMenuItem
                      key={tab.value}
                      onClick={() => handleTabChange(tab.value)}
                      className={`cursor-pointer ${
                        activeTab === tab.value ? "bg-accent" : ""
                      }`}
                    >
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Tabs - visible on large screens */}
            <div className="hidden lg:block">
              <TabsList className="h-9 flex gap-1">
                {visibleTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 py-1.5"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </div>

        <div>
          <TabsContent value="session" className="space-y-4 px-1 sm:px-0">
            <AppointmentInfo appointment={appointment} />
          </TabsContent>
          {showUserTab && (
            <TabsContent value="user" className="space-y-4 px-1 sm:px-0">
              <PatientInfo appointment={appointment} />
            </TabsContent>
          )}
          <TabsContent value="conversations" className="space-y-4 px-1 sm:px-0">
            <ChatWindow />
          </TabsContent>
          <TabsContent value="notes" className="space-y-4 px-1 sm:px-0">
            <Notes appointment={appointment} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
