import type { Chat, ChatMessage, ChatsById, MessageStatus } from './types';

const STATUS_RANK: Record<MessageStatus, number> = {
  pending: 0,
  sent: 1,
  delivered: 2,
  read: 3,
  failed: 4,
};

export function isStatusUpgrade(current: MessageStatus | undefined, next: MessageStatus): boolean {
  return STATUS_RANK[next] > STATUS_RANK[current ?? 'pending'];
}

export function ensureChat(
  entities: ChatsById,
  chatId: string,
  name: string | null,
  createdAt: number = Date.now(),
): Chat {
  const existing = entities[chatId];
  if (existing) {
    existing.name ||= name;
    return existing;
  }
  const chat: Chat = { id: chatId, name, messages: [], unreadCount: 0, updatedAt: createdAt };
  entities[chatId] = chat;
  return chat;
}

export function findMessage(
  entities: ChatsById,
  chatId: string,
  messageId: string,
): ChatMessage | undefined {
  return entities[chatId]?.messages.find((m) => m.id === messageId);
}

export function insertMessage(chat: Chat, message: ChatMessage): void {
  let index = chat.messages.length;
  while (index > 0 && chat.messages[index - 1].timestamp > message.timestamp) {
    index -= 1;
  }
  chat.messages.splice(index, 0, message);
  chat.updatedAt = Math.max(chat.updatedAt, message.timestamp);
}
