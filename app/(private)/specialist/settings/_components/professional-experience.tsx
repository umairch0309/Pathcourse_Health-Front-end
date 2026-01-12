"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock data - in real app, this would come from API
const professionalData = {
  profession: 'Cardiologist',
  ageGroup: 'Adults (18-65)',
  language: 'English, Spanish',
  specialInterest: 'Heart Disease Prevention',
};

export default function ProfessionalExperience() {
  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>
          <div className='text-foreground font-bold'>Professional Experience</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 lg:space-y-8">
        <div>
          <div className="block lg:hidden space-y-4">
            <div>
              <div className="text-foreground mb-2">Profession</div>
              <div className="text-muted-foreground border-b pb-2">{professionalData.profession}</div>
            </div>
            <div>
              <div className="text-foreground mb-2">Age group</div>
              <div className="text-muted-foreground border-b pb-2">{professionalData.ageGroup}</div>
            </div>
            <div>
              <div className="text-foreground mb-2">Language</div>
              <div className="text-muted-foreground border-b pb-2">{professionalData.language}</div>
            </div>
            <div>
              <div className="text-foreground mb-2 font-medium">Special interest area</div>
              <div className="text-muted-foreground border-b pb-2">{professionalData.specialInterest}</div>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2">
            <div className="space-y-6">
              <div className="text-foreground border-b p-2 font-medium text-sm">Profession</div>
              <div className="text-foreground border-b p-2 font-medium text-sm">Age group</div>
              <div className="text-foreground border-b p-2 font-medium text-sm">Language</div>
              <div className="text-foreground border-b p-2 font-medium text-sm">Special interest area</div>
            </div>
            <div className="space-y-6">
              <div className="border-b p-2 text-sm">{professionalData.profession}</div>
              <div className="border-b p-2 text-sm">{professionalData.ageGroup}</div>
              <div className="border-b p-2 text-sm">{professionalData.language}</div>
              <div className="border-b p-2 text-sm">{professionalData.specialInterest}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end pt-4">
          <Button className="w-full lg:w-auto">Edit Professional Experience</Button>
        </div>
      </CardContent>
    </Card>
  );
}

