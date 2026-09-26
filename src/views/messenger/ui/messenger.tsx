'use client';

import { ChatSidebar } from '@/widgets/chat-sidebar';
import { ChatWindow } from '@/widgets/chat-window';
import { useNotificationPolling } from '@/features/receive-messages';
import { selectActiveChatId } from '@/entities/chat';
import { useAppSelector } from '@/shared/lib/store';
import { cn } from '@/shared/lib/utils';

export function Messenger() {
  const connectionError = useNotificationPolling(true);
  const hasActiveChat = useAppSelector(selectActiveChatId) !== null;

  return (
    <main className="relative h-dvh xl:px-5 xl:py-5">
      <div
        className="absolute inset-x-0 top-0 -z-10 hidden h-32 bg-primary xl:block dark:bg-panel-header"
        aria-hidden
      />
      <div className="mx-auto flex h-full max-w-[1600px] overflow-hidden bg-panel xl:shadow-lg">
        <div
          className={cn(
            'h-full w-full md:block md:w-[40%] md:max-w-[480px] md:min-w-[320px] lg:w-[30%]',
            hasActiveChat && 'hidden',
          )}
        >
          <ChatSidebar connectionError={connectionError} />
        </div>
        <div className={cn('h-full min-w-0 flex-1 md:block', !hasActiveChat && 'hidden')}>
          <ChatWindow />
        </div>
      </div>
    </main>
  );
}
