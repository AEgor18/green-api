'use client';

import { useMemo } from 'react';

import { useRetryMessage } from '@/features/send-message';
import type { ChatMessage } from '@/entities/chat';
import { MessageBubble } from '@/entities/chat';
import { useScrollToBottom } from '@/shared/lib/use-scroll-to-bottom';

import { groupMessagesByDay } from '../lib/group-by-day';

import { DaySeparator } from './day-separator';

interface MessageListProps {
  chatId: string;
  messages: ChatMessage[];
}

function NoMessages() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <p className="rounded-lg bg-bubble-in/90 px-4 py-2 text-center text-sm text-meta shadow-sm">
        Сообщений пока нет. Напишите первым!
      </p>
    </div>
  );
}

export function MessageList({ chatId, messages }: MessageListProps) {
  const retry = useRetryMessage();
  const groups = useMemo(() => groupMessagesByDay(messages), [messages]);
  const bottomRef = useScrollToBottom<HTMLDivElement>(`${chatId}:${messages.at(-1)?.id}`);

  if (messages.length === 0) {
    return <NoMessages />;
  }

  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3 sm:px-[6%]"
      role="log"
      aria-label="Сообщения"
      aria-live="polite"
    >
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-1">
          <DaySeparator label={group.label} />
          {group.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onRetry={() => retry(chatId, message.id)}
            />
          ))}
        </section>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
