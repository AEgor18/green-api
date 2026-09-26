export type MessageDirection = 'incoming' | 'outgoing';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  chatId: string;
  text: string;
  direction: MessageDirection;
  timestamp: number;
  status?: MessageStatus;
  unsupported?: boolean;
}

export interface Chat {
  id: string;
  name: string | null;
  messages: ChatMessage[];
  unreadCount: number;
  updatedAt: number;
}

export type ChatsById = Record<string, Chat>;
