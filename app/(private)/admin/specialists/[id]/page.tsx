'use client';

import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';

export default function DoctorInfo() {
  return (
    <main className="min-h-screen space-y-4">
    <Typography variant="h5" className="font-bold text-foreground mb-6">Specialist Details</Typography>
      <Card className="rounded-2xl w-full py-4 bg-background">
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="mx-auto lg:h-[300px] lg:w-[500px] h-[250px] w-[250px] overflow-hidden rounded-xl md:mx-0 relative">
              <Image
                src="/dr-john.jpg"
                alt="Prof. Dr. John Carter"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              <Typography variant="h6" className='font-bold text-foreground'>Prof. Dr. John Carter</Typography>
              <div>
                <Badge variant="default" className="gap-1.5 px-4 py-2 rounded-full bg-accent text-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span>Open Ear Specialist</span>
                </Badge>
              </div>
              <Typography variant="span" className='text-foreground'>
                Dr. John Carter is a highly experienced Speech Pathologist who provides high-quality specialist services to
                children needing support with literacy, language, speech and social skill. She has over 15 years of experience in
                best practice service delivery.
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl w-full bg-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Provider Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="h-auto justify-start gap-2 bg-transparent p-0">
              <TabsTrigger value="details" className="p-3">
                Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="p-3">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-wide text-primary">Language:</div>
                  <div className="text-sm text-muted-foreground">English, Spanish</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium tracking-wide text-primary">Special interest area:</div>
                <div className="text-sm text-muted-foreground">
                  Developmental Language Disorder (DLD), Literacy, Articulation, Supporting autistic individuals, Parent and
                  caregiver coaching, Early language supports, Social Skills
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-wide text-primary">Service delivery:</div>
                  <div className="text-sm text-muted-foreground">Immediate</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-6">
              <div className=" p-6 text-sm text-muted-foreground">
                Availability calendar coming soon.
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className=" p-6 text-sm text-muted-foreground">
                No reviews yet.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}