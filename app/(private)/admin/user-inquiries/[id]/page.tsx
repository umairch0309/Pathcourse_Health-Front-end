'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

export default function InquiryDetailView() {
  const [response, setResponse] = useState('');

  const handleSendResponse = () => {
    console.log('Sending response:', response);
    setResponse('');
  };

  return (
    <main className="w-full space-y-6 px-2 sm:px-4 lg:px-0">
      <div className="flex items-center justify-between">
        <Typography variant="h5" className="font-bold text-foreground">
          User Inquiries
        </Typography>
      </div>

      <div className="bg-background border rounded-md p-6 space-y-6">
        <Badge variant="secondary" className="bg-muted/50 p-2 rounded-full text-muted-foreground">
          ID: 3598734
        </Badge>
        <div className="flex items-start gap-4">
          <Image src="/doc-1.svg" alt="Sender avatar" width={40} height={40} className="rounded-full" />
          <div className="flex-1 space-y-1 mt-2">
            <Typography variant="p" className="font-semibold text-foreground">
              Cody Fisher
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Email</span>
            <div className="text-foreground">cody.fisher@example.com</div>
          </div>
          <div>
            <span className="font-medium">Phone</span>
            <div className="text-foreground">(316) 555-0116</div>
          </div>
          <div>
            <span className="font-medium">Created on</span>
            <div className="text-foreground">Dec 30, 2019</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Typography variant="span" className="font-semibold text-foreground mb-2">
              Inquiry Message
            </Typography>
            <div>Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante.</div>
          </div>

          <div>
            <Typography variant="span" className="font-semibold text-foreground mb-2">
              Your Respond
            </Typography>
            <div>
              Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna.
              Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
              tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu.
              Curabitur pellentesque nibh nibh, at maximus ante.
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter your message"
            value={response}
            onChange={e => setResponse(e.target.value)}
            className="flex-1 border border-muted-foreground/50 rounded-md p-2"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendResponse();
              }
            }}
          />
          <Button onClick={handleSendResponse} className="bg-foreground text-background">
            <Image src="/send.svg" alt="Send" width={20} height={20} />
          </Button>
        </div>
      </div>
    </main>
  );
}