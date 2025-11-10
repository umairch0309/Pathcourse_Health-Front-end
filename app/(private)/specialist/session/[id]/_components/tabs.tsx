'use client';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-modified';
import AppointmentInfo from './session-ino';
import PatientInfo from './user-info';
import ChatWindow from './conversation';
import MedicalInfo from './medical-info';
import Notes from './notes';


type TabValue = 'session' | 'user' | 'conversations' | 'notes' | 'medical';

const tabsConfig = [
  { value: 'session' as TabValue, label: 'Session Info' },
  { value: 'user' as TabValue, label: 'User Info' },
  { value: 'medical' as TabValue, label: 'Medical Info' },
  { value: 'conversations' as TabValue, label: 'Conversations' },
  { value: 'notes' as TabValue, label: 'Notes' },
];

export function DetailsTabs({
  defaultTab = 'session',
}: {
  defaultTab?: TabValue;
}) {
  const [activeTab, setActiveTab] = useState<TabValue>(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
  };

  const getCurrentTabLabel = () => {
    return tabsConfig.find(tab => tab.value === activeTab)?.label || 'session';
  };

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                  {tabsConfig.map(tab => (
                    <DropdownMenuItem
                      key={tab.value}
                      onClick={() => handleTabChange(tab.value)}
                      className={`cursor-pointer ${
                        activeTab === tab.value ? 'bg-accent' : ''
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
                {tabsConfig.map(tab => (
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
            <AppointmentInfo />
          </TabsContent>
          <TabsContent value="user" className="space-y-4 px-1 sm:px-0">
            <PatientInfo />
          </TabsContent>
          <TabsContent value="medical" className="space-y-4 px-1 sm:px-0">
            <MedicalInfo />
          </TabsContent>
          <TabsContent value="conversations" className="space-y-4 px-1 sm:px-0">
            <ChatWindow />
          </TabsContent>
          <TabsContent value="notes" className="space-y-4 px-1 sm:px-0">
            <Notes />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}