import { chatIdToPhone, formatPhone } from '@/shared/lib/phone';

import type { Chat } from '../model/types';

export function getChatTitle(chat: Pick<Chat, 'id' | 'name'>): string {
  return chat.name || formatPhone(chatIdToPhone(chat.id));
}

export function getChatInitials(chat: Pick<Chat, 'name'>): string | null {
  if (!chat.name) {
    return null;
  }
  const letters = chat.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase());
  return letters.join('') || null;
}

export function getLastMessage(chat: Chat) {
  return chat.messages.at(-1) ?? null;
}
