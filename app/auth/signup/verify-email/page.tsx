'use client';

import { Suspense } from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

function VerifyEmailContent() {
  return (
    <div className="w-full p-4 flex items-center justify-center">
      <div className="w-full max-w-lg text-center space-y-4 sm:space-y-2">
        <Typography variant="h4" className="text-foreground font-bold">
          Verify Email
        </Typography>

        <div className="space-y-1">
          <Typography variant="span" className="text-gray-600 text-center">
          A verification link has been sent to your email address. Please click on that link to verify your identity to continue using Path Course Health services.
          </Typography>
        </div>

        <Button variant="link" className=" font-semibold text-primary text-black">Resend Email</Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}