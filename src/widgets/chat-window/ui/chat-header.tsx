'use client';

import { ArrowLeft } from 'lucide-react';

import type { Chat } from '@/entities/chat';
import { ChatAvatar, chatClosed, getChatTitle } from '@/entities/chat';
import { chatIdToPhone, formatPhone } from '@/shared/lib/phone';
import { useAppDispatch } from '@/shared/lib/store';
import { Button } from '@/shared/ui/button';

interface ChatHeaderProps {
  chat: Chat;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const dispatch = useAppDispatch();

  return (
    <header className="flex h-15 shrink-0 items-center gap-3 border-l border-border bg-panel-header px-4">
      <Button
        variant="ghost"
        size="icon"
        className="-ml-2 text-meta md:hidden"
        onClick={() => dispatch(chatClosed())}
        aria-label="Назад к списку чатов"
      >
        <ArrowLeft className="size-5" />
      </Button>
      <ChatAvatar chat={chat} className="size-10" />
      <div className="min-w-0">
        <h2 className="truncate text-base">{getChatTitle(chat)}</h2>
        {chat.name && (
          <p className="truncate text-xs text-meta">{formatPhone(chatIdToPhone(chat.id))}</p>
        )}
      </div>
    </header>
  );
}
