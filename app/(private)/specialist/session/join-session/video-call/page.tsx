'use client';

import type React from 'react';

import { Camera, MessageSquare, Mic, Paperclip, PhoneOff, Send, Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Typography } from '@/components/ui/typography';
import { useRouter } from 'next/navigation';

type Msg = { id: string; side: 'left' | 'right'; text: string; time: string };

function Bubble({ side, text, time }: Msg) {
  const isRight = side === 'right';
  return (
    <div className={`flex items-end gap-2 ${isRight ? 'justify-end' : ''}`}>
      {!isRight && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/message1.svg" alt="avatar" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%] ${isRight ? 'text-right' : ''}`}>
        <div
          className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${isRight
            ? 'max-w-[320px] rounded-2xl bg-muted px-4 py-2 text-sm md:max-w-[420px]'
            : 'bg-muted text-foreground'
          }`}
        >
          {text}
          <div className="mt-1 text-[10px] text-foreground">{time}</div>
        </div>
        
      </div>
      {isRight && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatar.png" alt="you" />
          <AvatarFallback>YO</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function ChatPanel({
  messages,
  value,
  setValue,
  send,
  endRef,
  scrollHeightClass = 'h-[520px]',
}: {
  messages: Msg[];
  value: string;
  setValue: (v: string) => void;
  send: () => void;
  endRef: React.MutableRefObject<HTMLDivElement | null>;
  scrollHeightClass?: string;
}) {
  // Filter to show only sent messages (right side)
  const sentMessages = messages.filter(m => m.side === 'right');

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-4">
        <Typography variant="p" className="font-bold text-foreground">
          In Call Chat
        </Typography>
      </div>
      <div className="mt-2 flex-1 px-4">
        <ScrollArea className={`${scrollHeightClass} pr-2`}>
          <div className="space-y-6 py-2">
            {sentMessages.map(m => (
              <Bubble key={m.id} {...m} />
            ))}
            <div ref={endRef} />
          </div>
        </ScrollArea>
      </div>
      <div className=" p-3">
        <p className="text-xs text-muted-foreground mb-2">Patient can only view the chat or attachments</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Enter your message"
            className="h-10 flex-1 border border-border rounded-md p-2"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button variant="default" onClick={send} className="bg-foreground text-background h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CallPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', side: 'left', text: 'Hello, how are you today?', time: '08:39 pm' },
    { id: '2', side: 'right', text: 'Hello, how are you today?', time: '08:39 pm' },
    { id: '3', side: 'left', text: 'Hello, how are you today?', time: '08:39 pm' },
    { id: '4', side: 'left', text: 'Hello, how are you today?', time: '08:39 pm' },
    { id: '5', side: 'right', text: 'Hello, how are you today?', time: '08:39 pm' },
  ]);
  const [value, setValue] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  function send() {
    const v = value.trim();
    if (!v) {
      return;
    }
    setMessages(m => [
      ...m,
      {
        id: crypto.randomUUID(),
        side: 'right',
        text: v,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setValue('');
  }
  const router = useRouter();

  return (
    <main className="min-h-screen rounded-md bg-background shadow-md">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <section className="space-y-4">
            <Card className="overflow-hidden border-none bg-background p-0">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute left-4 top-3 z-10 text-sm font-bold text-foreground">Therapist Name</div>
                  <Image
                    src="/video-call-doc.jpg"
                    alt="Therapist"
                    width={1280}
                    height={720}
                    className="h-[260px] w-full object-cover sm:h-[300px] md:h-[320px] lg:h-[300px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none bg-background p-0">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute left-4 top-3 z-10 text-sm font-bold text-foreground">
                    You (Emelie Cooper)
                  </div>
                  <Image
                    src="/video-call-patient.jpg"
                    alt="You"
                    width={1280}
                    height={720}
                    className="h-[260px] w-full object-cover sm:h-[300px] md:h-[340px] lg:h-[320px]"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full bg-foreground border-foreground"
                        aria-label="Microphone"
                      >
                        <Mic className="h-5 w-5 text-background" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full bg-foreground border-foreground"
                        aria-label="Camera"
                      >
                        <Camera className="h-5 w-5 text-background" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full bg-foreground border-foreground"
                        aria-label="Upload"
                      >
                        <Upload className="h-5 w-5 text-background" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-destructive bg-destructive text-background"
                        aria-label="End call"
                        onClick={() => router.push('/specialist/session')}
                      >
                        <PhoneOff className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="hidden flex-col lg:flex">
            <ChatPanel messages={messages} value={value} setValue={setValue} send={send} endRef={endRef} />
          </aside>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="default">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <ChatPanel
              messages={messages}
              value={value}
              setValue={setValue}
              send={send}
              endRef={endRef}
              scrollHeightClass="h-[calc(85vh-120px)]"
            />
          </SheetContent>
        </Sheet>
      </div>
    </main>
  );
}