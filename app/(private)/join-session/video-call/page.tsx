'use client';
import { Mic, Phone, Share2, Video } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import Header from '@/app/(public)/header';
import { useRouter } from 'next/navigation';

export default function VideoCallPage() {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const router = useRouter();

  const handleEndCall = () => {
    router.push('/patient/session');
    console.log('Ending call...');
  };

  return (
    <div>
    <Header />
    <div className="bg-background p-2 sm:p-4 pt-16 sm:pt-20">
      <div className="h-[calc(90vh-2rem)] sm:h-[calc(90vh-2rem)] max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 h-full">
          {/* Left Column - Video Feeds */}
          <div className="lg:col-span-2 flex flex-col gap-2 sm:gap-3 lg:gap-4 h-full">
            {/* Top Video Feed - Specialist */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-muted flex-1 min-h-[200px] sm:min-h-[250px] lg:min-h-0">
              <Image
                src="/video-call-doc.jpg"
                alt="Specialist"
                fill
                className="object-cover"
              />
              {/* Specialist Name Label */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                <Typography variant="p" className="text-foreground font-medium bg-background/80 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
                  Specialist Name
                </Typography>
              </div>
              {/* Audio Indicator */}
              <div className="absolute top-2 sm:top-4 left-24 sm:left-32 md:left-48">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary-foreground rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Bottom Video Feed - Patient */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-muted flex-1 min-h-[200px] sm:min-h-[250px] lg:min-h-0">
              <Image
                src="/video-call-patient.jpg"
                alt="Patient"
                fill
                className="object-cover"
              />
              {/* Patient Name Label */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                <Typography variant="p" className="text-foreground font-medium bg-background/80 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
                  You (Emelie Cooper)
                </Typography>
              </div>
              {/* Control Buttons at Bottom */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3">
                <Button
                  variant={isMicEnabled ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={() => setIsMicEnabled(!isMicEnabled)}
                  className="rounded-full bg-background/90 hover:bg-background h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant={isVideoEnabled ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className="rounded-full bg-background/90 hover:bg-background h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant={isScreenShareEnabled ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={() => setIsScreenShareEnabled(!isScreenShareEnabled)}
                  className="rounded-full bg-background/90 hover:bg-background h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleEndCall}
                  className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Chat Panel */}
          <div className="flex flex-col bg-background rounded-xl sm:rounded-2xl overflow-hidden h-[300px] sm:h-[400px] lg:h-auto">
            {/* Chat Header */}
            <div className="border-b border-border p-3 sm:p-4">
              <Typography variant="p" className="text-foreground font-semibold text-sm sm:text-base">
                In Call Chat
              </Typography>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4 px-3 sm:px-4">
              <div className="flex gap-2 sm:gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src="/avatar.png" alt="Specialist" />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-2 mb-1">
                    <Typography variant="span" className="text-foreground text-xs sm:text-sm">
                      Hello, Patient!
                      <br />
                      <span className="text-muted-foreground text-xs">
                        08:39 pm
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src="/avatar.png" alt="Specialist" />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-2 mb-1">
                    <Typography variant="span" className="text-foreground text-xs sm:text-sm">
                      Hello, how are you today?
                      <br />
                      <span className="text-muted-foreground text-xs">
                        08:39 pm
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <Typography variant="span" className="text-muted-foreground text-xs">
                Patient can only view the chat or attachments
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

