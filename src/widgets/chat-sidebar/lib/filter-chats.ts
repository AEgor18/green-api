import type { Chat } from '@/entities/chat';
import { getChatTitle } from '@/entities/chat';

export function filterChats(chats: Chat[], query: string): Chat[] {
  const text = query.trim().toLowerCase();
  if (!text) {
    return chats;
  }
  const digits = text.replace(/\D/g, '');
  return chats.filter(
    (chat) =>
      getChatTitle(chat).toLowerCase().includes(text) ||
      (digits !== '' && chat.id.includes(digits)),
  );
}
