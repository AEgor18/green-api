'use client';

import { MessagesSquare } from 'lucide-react';
import { useDeferredValue, useMemo } from 'react';

import { chatOpened, ChatListItem, selectActiveChatId, selectChatList } from '@/entities/chat';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';

import { filterChats } from '../lib/filter-chats';

interface ChatListProps {
  query: string;
}

function NoChats() {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-16 text-center text-sm text-meta">
      <MessagesSquare className="size-10 opacity-60" aria-hidden />
      <p>Чатов пока нет. Начните новый по номеру телефона или дождитесь входящего сообщения.</p>
    </div>
  );
}

export function ChatList({ query }: ChatListProps) {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChatList);
  const activeChatId = useAppSelector(selectActiveChatId);
  const deferredQuery = useDeferredValue(query);
  const visibleChats = useMemo(() => filterChats(chats, deferredQuery), [chats, deferredQuery]);

  return (
    <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Список чатов">
      {visibleChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          active={chat.id === activeChatId}
          onSelect={(chatId) => dispatch(chatOpened({ chatId }))}
        />
      ))}
      {chats.length === 0 && <NoChats />}
      {chats.length > 0 && visibleChats.length === 0 && (
        <p className="px-8 py-10 text-center text-sm text-meta">Ничего не найдено</p>
      )}
    </nav>
  );
}
