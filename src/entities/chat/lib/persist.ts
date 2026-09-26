import { storage } from '@/shared/lib/storage';

import type { ChatsById } from '../model/types';

export const chatsStorageKey = (idInstance: string) => `green-chat:chats:${idInstance}`;

export function loadChats(idInstance: string): ChatsById {
  const chats = storage.get<ChatsById>(chatsStorageKey(idInstance));
  if (!chats || typeof chats !== 'object') {
    return {};
  }
  for (const chat of Object.values(chats)) {
    for (const message of chat.messages) {
      if (message.status === 'pending') {
        message.status = 'failed';
      }
    }
  }
  return chats;
}

export function saveChats(idInstance: string, chats: ChatsById): void {
  storage.set(chatsStorageKey(idInstance), chats);
}
