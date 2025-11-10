import { BadgeCheck, ClipboardList } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import ContactInfo from './_components/contact-info';
import EducationInfo from './_components/education-info';
import ProfessionalExperience from './_components/professional-experience';
import ProfessionalDocuments from './_components/documents';

export default function DoctorDetails() {
  return (
    <div className="space-y-6">
      <Typography variant="h5" className="font-bold text-foreground">Specialist Info</Typography>
      <div className="bg-background rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex lg:flex-row flex-col gap-6 mb-8">
          <div className="flex-shrink-0 lg:h-[250px] flex justify-center">
            <Image
              src="/dr-john.jpg"
              width={250}
              height={250}
              alt="Doctor"
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-4 lg:mt-8">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  Prof. Dr. John Carter
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="default" className="rounded-full text-foreground bg-accent px-3 py-1 flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4" />
                    Speech Pathologist
                  </Badge>
                  <Badge variant="default" className="rounded-full  text-foreground bg-accent px-3 py-1 flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" />
                    35064
                  </Badge>
                </div>
                <div className="text-sm text-foreground/80">
                  Dr. John Carter is a highly experienced Speech Pathologist who provides high-quality specialist
                  services to children needing support with literacy, language, speech and social skill. She has over 15
                  years of experience in best practice service delivery.
                </div>
              </div>
             
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-row gap-2 w-full sm:w-auto">
                <Button className="w-full sm:w-auto">Accept Registration</Button>
                <Button variant="destructive" className="w-full sm:w-auto bg-background border border-destructive text-destructive hover:bg-destructive/10">Reject Request</Button>
              </div>
        </div>
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger className='text-foreground font-semibold bg-muted data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2' value="contact">Contact Info</TabsTrigger>
            <TabsTrigger className='text-foreground font-semibold bg-muted data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2' value="education">Educational Info</TabsTrigger>
            <TabsTrigger className='text-foreground font-semibold bg-muted data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2' value="professional">Professional Experience</TabsTrigger>
            <TabsTrigger className='text-foreground font-semibold bg-muted data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground p-2' value="documents">Attached Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="contact" className="mt-6">
            <ContactInfo />
          </TabsContent>
          <TabsContent value="education" className="mt-6">
            <EducationInfo />
          </TabsContent>
          <TabsContent value="professional" className="mt-6">
            <ProfessionalExperience />
          </TabsContent>
          <TabsContent value="documents" className="mt-6">
            <ProfessionalDocuments />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}