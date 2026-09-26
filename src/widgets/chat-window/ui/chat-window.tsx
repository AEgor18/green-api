'use client';

import { MessageComposer } from '@/features/send-message';
import { getChatTitle, selectActiveChat } from '@/entities/chat';
import { useAppSelector } from '@/shared/lib/store';

import { ChatHeader } from './chat-header';
import { ChatPlaceholder } from './chat-placeholder';
import { MessageList } from './message-list';

export function ChatWindow() {
  const chat = useAppSelector(selectActiveChat);

  if (!chat) {
    return <ChatPlaceholder />;
  }

  return (
    <section
      className="flex h-full min-h-0 flex-col chat-wallpaper"
      aria-label={`Чат: ${getChatTitle(chat)}`}
    >
      <ChatHeader chat={chat} />
      <MessageList chatId={chat.id} messages={chat.messages} />
      <MessageComposer key={chat.id} chatId={chat.id} />
    </section>
  );
}
