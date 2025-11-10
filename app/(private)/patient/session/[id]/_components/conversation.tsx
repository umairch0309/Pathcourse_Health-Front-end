'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Msg = {
  id: string;
  text: string;
  time: string;
};

const initial: Msg[] = [
  { id: '1', text: 'Hello, how are you today?', time: '08:39 pm' },
  { id: '2', text: 'Hello, how are you today?', time: '08:40 pm' },
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

function MessageBubble({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-end gap-3">
      <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-foreground/5 flex-shrink-0">
        <Image src="/avatar.png" alt="Patient avatar" fill className="object-cover" sizes="32px" />
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

export default function ChatWindow() {
  const [messages] = useState<Msg[]>(initial);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex flex-col rounded-2xl border bg-background w-full max-h-[80vh]">
      <div className="relative overflow-y-auto p-4 md:p-6">
        <DateDivider label="Sep 12" />
        <div className="space-y-8">
          {messages.map(m => (
            <MessageBubble key={m.id} text={m.text} time={m.time} />
          ))}
          <div ref={endRef} />
          <DateDivider label="Sep 12" />
          {messages.map(m => (
            <MessageBubble key={m.id} text={m.text} time={m.time} />
          ))}
        </div>
      </div>
    </div>
  );
}