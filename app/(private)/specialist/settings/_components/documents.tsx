"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Mock data - in real app, this would come from API
const documents = [
  { label: 'Resume', file: 'resume.pdf' },
  { label: 'Malpractice insurance', file: 'malpractice_insurance.pdf' },
  { label: 'Telemedicine privilege certificate', file: 'telemedicine_certificate.pdf' },
  { label: 'Medical License', file: 'medical_license.pdf' },
  { label: 'Other attachments', file: 'other_attachment_1.pdf' },
  { label: 'Other affiliations', file: 'affiliation_1.pdf' },
];

export default function Documents() {
  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>
          <div className='text-foreground font-bold'>Documents</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 lg:space-y-8">
        <div>
          <div className="block lg:hidden space-y-4">
            {documents.map((doc, index) => (
              <div key={index}>
                <div className="text-foreground mb-2">{doc.label}</div>
                <div className="flex items-center justify-between text-muted-foreground border-b pb-2">
                  <span className="text-sm">{doc.file}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:grid grid-cols-2">
            <div className="space-y-6">
              {documents.map((doc, index) => (
                <div key={index} className="text-foreground border-b p-2 font-medium text-sm">
                  {doc.label}
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 border-b p-2 text-sm">
                  <Image
                    src="/pdf.svg"
                    alt="pdf"
                    width={10}
                    height={10}
                  />
                  <span>{doc.file}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end pt-4">
          <Button className="w-full lg:w-auto">Edit Documents</Button>
        </div>
      </CardContent>
    </Card>
  );
}

