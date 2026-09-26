import { formatChatTime } from '@/shared/lib/time';
import { cn } from '@/shared/lib/utils';

import { getChatTitle, getLastMessage } from '../lib/display';
import type { Chat } from '../model/types';

import { ChatAvatar } from './chat-avatar';
import { LastMessagePreview } from './last-message-preview';
import { UnreadBadge } from './unread-badge';

interface ChatListItemProps {
  chat: Chat;
  active: boolean;
  onSelect: (chatId: string) => void;
}

export function ChatListItem({ chat, active, onSelect }: ChatListItemProps) {
  const last = getLastMessage(chat);
  const hasUnread = chat.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(chat.id)}
      aria-current={active || undefined}
      className={cn(
        'flex w-full items-center gap-3 px-3 text-left transition-colors hover:bg-hover',
        active && 'bg-selected hover:bg-selected',
      )}
    >
      <ChatAvatar chat={chat} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 border-b border-border py-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[17px] text-foreground">{getChatTitle(chat)}</span>
          {last && (
            <span className={cn('shrink-0 text-xs', hasUnread ? 'text-unread' : 'text-meta')}>
              {formatChatTime(last.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <LastMessagePreview message={last} />
          {hasUnread && <UnreadBadge count={chat.unreadCount} />}
        </div>
      </div>
    </button>
  );
}
