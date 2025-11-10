'use client';

import { Paperclip, Send } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Msg = {
  id: string;
  side: 'left' | 'right';
  text: string;
  time: string;
};

const initial: Msg[] = [
  { id: '1', side: 'left', text: 'Hello, how are you today?', time: '08:39 pm' },
  { id: '2', side: 'right', text: 'Hello, how are you today?', time: '08:39 pm' },
  { id: '3', side: 'left', text: 'Hello, how are you today?', time: '08:39 pm' },
];

function DateDivider({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center gap-4">
      <div className="h-px flex-1 bg-muted" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-muted" />
    </div>
  );
}

function LeftBubble({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-end gap-3">
      <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-foreground/5">
        <Image src="/message1.svg" alt="Sender avatar" fill className="object-cover" sizes="32px" />
      </div>
      <div>
        <div className="max-w-[320px] rounded-2xl bg-muted px-4 py-2 text-sm md:max-w-[420px] break-words whitespace-pre-wrap">
          {text}
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">{time}</div>
      </div>
    </div>
  );
}

function RightBubble({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-end justify-end gap-3">
      <div className="text-right">
        <div className="ml-auto max-w-[320px] rounded-2xl bg-muted px-4 py-2 text-sm md:max-w-[420px] break-words whitespace-pre-wrap">
          {text}
          <div className="mt-1 text-[10px] text-foreground">{time}</div>
        </div>
      </div>
      <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-foreground/5">
        <Image src="/avatar.png" alt="You" fill className="object-cover" sizes="32px" />
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [value, setValue] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  // Filter to show only sent messages (right side)
  const sentMessages = messages.filter(m => m.side === 'right');

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

  return (
    <div className="flex lg:h-[80vh] flex-col rounded-2xl border bg-background w-full">
      <div className="relative flex-1 overflow-y-auto p-4 md:p-6">
        <DateDivider label="Sep 12" />
        <div className="space-y-8">
          {sentMessages.map(m => (
            <RightBubble key={m.id} text={m.text} time={m.time} />
          ))}
          <div ref={endRef} />
        </div>
      </div>
      <div className="p-3 md:p-4">
        <p className="text-xs text-muted-foreground mb-2">Patient can only view the chat or attachments</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted bg-transparent"
            aria-label="Attach"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter your message"
            className="h-10 flex-1 border border-border p-2 rounded-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button
            type="button"
            variant="default"
            onClick={send}
            aria-label="Send"
            className="bg-foreground text-background h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}