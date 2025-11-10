import { Calendar, HeartPulse, Mail, MapPinHouse, Phone, User, VenusAndMars } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type InfoItemProps = {
  icon: React.ElementType;
  label: string;
  value: string | number;
};

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
        <Icon className="h-4 w-4 text-foreground " />
      </div>
      <div className="grid gap-0.5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

export default function PatientInfo() {
  return (
    <Card className="bg-background w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 border-b pb-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem icon={User} label="User name:" value="Emilie Corner" />
          <InfoItem icon={Calendar} label="Session taken for:" value="My Self" />
          <InfoItem icon={HeartPulse} label="Service needed:" value="Skin Care" />
          <InfoItem icon={HeartPulse} label="User Age:" value="25 years" />
          <InfoItem icon={VenusAndMars} label="User Gender:" value="Male" />
        </div>
      </CardContent>

      <CardHeader className="pb-4 pt-0">
        <CardTitle className="text-lg font-semibold">Contact Info</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem icon={Phone} label="Contact no.:" value="+1 (234) 567-8900" />
          <InfoItem icon={Mail} label="Contact email:" value="emiliecorner@gmail.com" />
        </div>
      </CardContent>
    </Card>
  );
}