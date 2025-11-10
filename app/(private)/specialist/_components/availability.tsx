'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function Availability() {
  const [availableNow, setAvailableNow] = useState(true);
  const [timeSlots, setTimeSlots] = useState({
    '15 min': true,
    '30 min': true,
    '60 min': true,
  });

  const handleTimeSlotToggle = (slot: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [slot]: !prev[slot as keyof typeof prev],
    }));
  };

  return (
    <Card className="bg-background rounded-lg">
      <CardContent className="p-6 space-y-6">
        {/* Available Now Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground mb-1">
                Available Now
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Turn it On/Off for your availability
              </p>
            </div>
            <Switch
              checked={availableNow}
              onCheckedChange={setAvailableNow}
            />
          </div>
        </div>

        {/* Time slots Section */}
        <div className="space-y-4">
          <CardTitle className="text-lg font-bold text-foreground">
            Time slots
          </CardTitle>
          
          <div className="space-y-0 w-[230px]">
            {/* 15 min */}
            <div className="flex items-center justify-between py-3">
              <span className="text-foreground">15 min</span>
              <Switch
                checked={timeSlots['15 min']}
                onCheckedChange={() => handleTimeSlotToggle('15 min')}
              />
            </div>
            <Separator />

            {/* 30 min */}
            <div className="flex items-center justify-between py-3">
              <span className="text-foreground">30 min</span>
              <Switch
                checked={timeSlots['30 min']}
                onCheckedChange={() => handleTimeSlotToggle('30 min')}
              />
            </div>
            <Separator />

            {/* 60 min */}
            <div className="flex items-center justify-between py-3">
              <span className="text-foreground">60 min</span>
              <Switch
                checked={timeSlots['60 min']}
                onCheckedChange={() => handleTimeSlotToggle('60 min')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

