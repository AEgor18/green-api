'use client';

import { useState } from 'react';

import { ChatList } from './chat-list';
import { ChatSearch } from './chat-search';
import { ConnectionBanner } from './connection-banner';
import { SidebarHeader } from './sidebar-header';

interface ChatSidebarProps {
  connectionError: string | null;
}

export function ChatSidebar({ connectionError }: ChatSidebarProps) {
  const [query, setQuery] = useState('');

  return (
    <aside className="flex h-full min-h-0 flex-col bg-panel" aria-label="Чаты">
      <SidebarHeader />
      {connectionError && <ConnectionBanner error={connectionError} />}
      <ChatSearch value={query} onChange={setQuery} />
      <ChatList query={query} />
    </aside>
  );
}
