'use client';
import { Mic, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import Header from '@/app/(public)/header';

export default function JoinSessionPage() {
  const router = useRouter();
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  useEffect(() => {
    // Request camera and microphone permissions
    const requestPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    requestPermissions();
  }, []);

  const handleJoinSession = () => {
    router.push('/join-session/video-call');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <Typography variant="h4" className="text-foreground font-bold mb-8">
            Join Individual Session
          </Typography>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Video Preview */}
            <div className="lg:col-span-2">
              <div className="bg-muted rounded-2xl aspect-video relative overflow-hidden">
                {/* Video Preview Area */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground">
                  <Typography variant="p" className="text-muted-foreground">
                    {isVideoEnabled ? 'Video feed will appear here' : 'Camera is off'}
                  </Typography>
                </div>

                {/* User Name Overlay */}
                <div className="absolute top-4 left-4">
                  <Typography variant="p" className="text-background font-medium">
                    Emilie Corner
                  </Typography>
                </div>

                {/* Audio Indicator */}
                {isMicEnabled && (
                  <div className="absolute top-4 left-32">
                    <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Controls at Bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <Button
                    variant={isMicEnabled ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setIsMicEnabled(!isMicEnabled)}
                    className="rounded-full p-2"
                  >
                    <Mic className="size-6" />
                  </Button>
                  <Button
                    variant={isVideoEnabled ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className="rounded-full p-2"
                  >
                    <Video className="size-6" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Ready To Join */}
            <div className="space-y-6 lg:mt-30 mt-10">
              <div>
                <Typography variant="h5" className="text-foreground font-bold">
                  Ready To Join?
                </Typography>
                <Typography variant="p" className="text-foreground mb-6">
                  Are you ready to join your individual session with therapist?
                </Typography>
                <Button variant="default" size="lg" className="w-full" onClick={handleJoinSession}>
                  Join Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

