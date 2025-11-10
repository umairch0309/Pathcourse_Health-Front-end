import type React from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  HeartPulse,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type InfoItemProps = {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
};

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 lg:gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent sm:h-8 sm:w-8">
        <Icon className="h-3.5 w-3.5 text-foreground sm:h-4 sm:w-4" />
      </div>
      <div className="grid min-w-0 gap-0.5">
        <div className="text-xs text-muted-foreground sm:text-sm">{label}</div>
        <div className="break-words text-sm font-medium sm:text-base">{value}</div>
      </div>
    </div>
  );
}

export default function AppointmentInfo() {
  return (
    <Card className="w-full bg-background">
      <CardHeader className="px-4 pb-3 sm:px-6 sm:pb-4">
        <CardTitle className="text-base font-semibold sm:text-lg">Overview</CardTitle>
      </CardHeader>
      <CardContent className="mb-4 grid gap-4 border-b px-4 pb-4 sm:mb-6 sm:gap-6 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          <InfoItem icon={FileText} label="Session ID:" value="2456256" />
          <InfoItem icon={Calendar} label="Date of Session:" value="Thursday, Oct. 09, 2024" />
          <InfoItem icon={Clock} label="Time of Session:" value="06:00 AM - 07:00 AM" />
          <InfoItem icon={HeartPulse} label="Session service:" value="Skin Care" />
          <InfoItem icon={DollarSign} label="Fee status:" value="Paid" />
        </div>
      </CardContent>
      <CardHeader className="px-4 pb-3 pt-0 sm:px-6 sm:pb-4">
        <CardTitle className="text-base font-semibold sm:text-lg">Specialist Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          <InfoItem icon={User} label="Specialist name:" value="John Doe" />
        </div>
      </CardContent>
    </Card>
  );
}