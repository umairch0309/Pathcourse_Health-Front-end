'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { useFetch } from '@/hooks/use-fetch';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Loader } from '@/components/loader';
import ErrorCard from '@/components/error-card';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type UserQuery = {
  id: string;
  message: string;
  name: string;
  number: string;
  email: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export default function InquiryDetailView() {
  const params = useParams();
  const inquiryId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [response, setResponse] = useState('');

  const { data, isLoading, error, refetch } = useFetch<UserQuery>({
    path: `/api/user-queries/${inquiryId}`,
    queryKey: ['user-query', inquiryId],
  });

  const handleSendResponse = () => {
    if (!data || !response.trim()) return;
    
    // Create mailto link with pre-filled email
    const subject = encodeURIComponent(`Re: Your Inquiry - ${data.id}`);
    const body = encodeURIComponent(response);
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(data.email)}&su=${subject}&body=${body}`;
    
    // Open Gmail in a new tab
    window.open(mailtoLink, '_blank');
    
    // Clear the input after sending
    setResponse('');
  };

  return (
    <main className="w-full space-y-6 px-2 sm:px-4 lg:px-0">
      <div className="flex items-center justify-between">
        <Typography variant="h5" className="font-bold text-foreground">
          User Inquiries
        </Typography>
      </div>

      <Card className="bg-background rounded-md p-6 space-y-6 shadow shadow-lg border border-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" variant="spinner" />
          </div>
        ) : error ? (
          <ErrorCard error={error} onRetry={() => refetch()} />
        ) : data ? (
          <>
            <div className="flex items-start gap-4">
              <Avatar className="size-10">
                <AvatarImage src={data.user?.id ? `/avatar.png` : undefined} alt={data.name} />
                <AvatarFallback>
                  <User className="w-5 h-5 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 mt-2">
                <Typography variant="p" className="font-semibold text-foreground">
                  {data.name}
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Email</span>
                <div className="text-foreground">{data.email}</div>
              </div>
              <div>
                <span className="font-medium">Phone</span>
                <div className="text-foreground">{data.number}</div>
              </div>
              <div>
                <span className="font-medium">Created on</span>
                <div className="text-foreground">{format(new Date(data.createdAt), 'MMM dd, yyyy')}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Typography variant="span" className="font-semibold text-foreground mb-2 block">
                  Inquiry Message
                </Typography>
                <div className="text-foreground whitespace-pre-wrap">{data.message}</div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Input
                placeholder="Enter your response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="flex-1 border border-muted-foreground/50 rounded-md p-2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendResponse();
                  }
                }}
              />
              <Button 
                onClick={handleSendResponse} 
                className="bg-foreground text-background"
                disabled={!response.trim()}
              >
                <Image src="/send.svg" alt="Send" width={20} height={20} />
              </Button>
            </div>
          </>
        ) : null}
      </Card>
    </main>
  );
}
