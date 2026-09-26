import type {
  MessageData,
  MessageWebhook,
  OutgoingMessageStatus,
  OutgoingStatusWebhook,
  WebhookBody,
} from '@/shared/api/green-api';

import type { ChatMessage, MessageStatus } from '../model/types';

export type ChatEvent =
  | { type: 'message'; message: ChatMessage; senderName?: string }
  | { type: 'status'; chatId: string; idMessage: string; status: MessageStatus };

const MESSAGE_WEBHOOKS = new Set<string>([
  'incomingMessageReceived',
  'outgoingMessageReceived',
  'outgoingAPIMessageReceived',
]);

const MEDIA_PLACEHOLDERS: Record<string, string> = {
  imageMessage: 'Фото',
  videoMessage: 'Видео',
  audioMessage: 'Голосовое сообщение',
  documentMessage: 'Документ',
  stickerMessage: 'Стикер',
  locationMessage: 'Геопозиция',
  contactMessage: 'Контакт',
  pollMessage: 'Опрос',
};

function isMessageWebhook(body: WebhookBody): body is MessageWebhook {
  return MESSAGE_WEBHOOKS.has(body.typeWebhook);
}

function isStatusWebhook(body: WebhookBody): body is OutgoingStatusWebhook {
  return body.typeWebhook === 'outgoingMessageStatus';
}

function extractText(data: MessageData): { text: string; unsupported?: true } {
  const text = data.textMessageData?.textMessage ?? data.extendedTextMessageData?.text;
  if (text !== undefined) {
    return { text };
  }
  return {
    text: MEDIA_PLACEHOLDERS[data.typeMessage] ?? 'Сообщение этого типа не поддерживается',
    unsupported: true,
  };
}

function mapStatus(status: OutgoingMessageStatus): MessageStatus {
  return status === 'noAccount' || status === 'notInGroup' ? 'failed' : status;
}

export function webhookToChatEvent(body: WebhookBody): ChatEvent | null {
  if (isMessageWebhook(body)) {
    const incoming = body.typeWebhook === 'incomingMessageReceived';
    const { chatId, senderName, senderContactName, chatName } = body.senderData;
    return {
      type: 'message',
      message: {
        id: body.idMessage,
        chatId,
        direction: incoming ? 'incoming' : 'outgoing',
        timestamp: body.timestamp * 1000,
        status: incoming ? undefined : 'sent',
        ...extractText(body.messageData),
      },
      senderName: incoming ? chatName || senderContactName || senderName : undefined,
    };
  }

  if (isStatusWebhook(body)) {
    return {
      type: 'status',
      chatId: body.chatId,
      idMessage: body.idMessage,
      status: mapStatus(body.status),
    };
  }

  return null;
}
