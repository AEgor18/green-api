'use client';

import { NewChatDialog } from '@/features/new-chat';
import { selectCredentials } from '@/entities/session';
import { useAppSelector } from '@/shared/lib/store';

import { SidebarMenu } from './sidebar-menu';

export function SidebarHeader() {
  const credentials = useAppSelector(selectCredentials);

  return (
    <header className="flex h-15 shrink-0 items-center justify-between bg-panel-header px-4">
      <div className="min-w-0">
        <h1 className="text-base font-semibold">Чаты</h1>
        <p className="truncate text-xs text-meta">Инстанс {credentials?.idInstance}</p>
      </div>
      <div className="flex items-center gap-1 text-meta">
        <NewChatDialog />
        <SidebarMenu apiUrl={credentials?.apiUrl ?? ''} />
      </div>
    </header>
  );
}
