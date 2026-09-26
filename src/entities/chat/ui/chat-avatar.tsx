import { UserRound } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';

import { getChatInitials } from '../lib/display';
import type { Chat } from '../model/types';

interface ChatAvatarProps {
  chat: Pick<Chat, 'name'>;
  className?: string;
}

export function ChatAvatar({ chat, className }: ChatAvatarProps) {
  const initials = getChatInitials(chat);
  return (
    <Avatar className={cn('size-12', className)}>
      <AvatarFallback className="bg-[#dfe5e7] text-base font-medium text-white dark:bg-[#6a7175]">
        {initials ?? <UserRound className="size-3/5" aria-hidden />}
      </AvatarFallback>
    </Avatar>
  );
}
