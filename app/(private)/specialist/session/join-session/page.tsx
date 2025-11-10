'use client';

import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';

type PermissionKind = 'audio' | 'video' | null;

export default function SessionPage() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<PermissionKind>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  function request(kind: PermissionKind) {
    setPending(kind);
    setError(null);
    setOpen(true);
  }

  async function allow() {
    if (!pending) {
      return;
    }
    try {
      setError(null);
      const constraints: MediaStreamConstraints = {
        audio: pending === 'audio' || audioEnabled,
        video: pending === 'video' || videoEnabled,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const current = streamRef.current;
      current?.getTracks().forEach(t => t.stop());
      streamRef.current = stream;
      if (constraints.video && videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setVideoEnabled(true);
      }
      if (constraints.audio) {
        setAudioEnabled(true);
      }
      setOpen(false);
      setPending(null);
    } catch {
      setError('Permission denied or device not available.');
    }
  }

  return (
    <main className="w-full">
      <div className="">
        <h1 className="mb-4 text-lg font-bold">Join Individual Session</h1>
        <div className="bg-background w-full lg:h-[480px] p-5 rounded-md flex justify-center items-center">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
            <div className="relative rounded-lg bg-foreground/95 lg:w-[500px]">
              <div className="absolute left-3 top-3 z-10 text-xs font-medium text-background/90">Emilie Corner</div>
              <video ref={videoRef} className="h-[46vh] w-full rounded-lg object-cover" playsInline muted />
              <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/10" />
              <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => request('audio')}
                    variant="outline"
                    className="rounded-full"
                    aria-label="Toggle microphone"
                  >
                    {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => request('video')}
                    variant="outline"
                    className="rounded-full"
                    aria-label="Toggle camera"
                  >
                    {videoEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-none bg-background">
              <CardContent className="py-20 space-y-2">
                <Typography variant="p" className="font-bold text-foreground">Ready To Join?</Typography>
                <Typography variant="span" className="text-foreground">
                  You are ready to join your individual session with therapist.
                </Typography>
                <Button variant="default" onClick={() => router.push('/specialist/session/join-session/video-call')}>Join Session</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Allow Permissions</DialogTitle>
            <DialogDescription>
              {pending === 'video'
                ? 'Allow access to your camera for this video session.'
                : 'Allow access to your microphone for this video session.'}
            </DialogDescription>
          </DialogHeader>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" className="ml-2" onClick={allow}>
              Allow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}