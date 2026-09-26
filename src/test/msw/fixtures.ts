import type {
  GreenApiCredentials,
  GreenApiNotification,
  MessageWebhook,
  OutgoingStatusWebhook,
} from '@/shared/api/green-api';

export const TEST_CREDENTIALS: GreenApiCredentials = {
  apiUrl: 'https://api.test.local',
  idInstance: '1101000001',
  apiTokenInstance: 'test-token-0123456789abcdef',
};

export const TEST_CHAT_ID = '79001234567@c.us';

export const methodUrl = (method: string) =>
  `${TEST_CREDENTIALS.apiUrl}/waInstance${TEST_CREDENTIALS.idInstance}/${method}/${TEST_CREDENTIALS.apiTokenInstance}`;

export function incomingTextWebhook(overrides: Partial<MessageWebhook> = {}): MessageWebhook {
  return {
    typeWebhook: 'incomingMessageReceived',
    timestamp: 1_758_880_000,
    idMessage: 'IN-1',
    senderData: {
      chatId: TEST_CHAT_ID,
      sender: TEST_CHAT_ID,
      senderName: 'Иван',
    },
    messageData: {
      typeMessage: 'textMessage',
      textMessageData: { textMessage: 'Привет!' },
    },
    ...overrides,
  };
}

export function statusWebhook(
  overrides: Partial<OutgoingStatusWebhook> = {},
): OutgoingStatusWebhook {
  return {
    typeWebhook: 'outgoingMessageStatus',
    timestamp: 1_758_880_100,
    chatId: TEST_CHAT_ID,
    idMessage: 'OUT-1',
    status: 'delivered',
    ...overrides,
  };
}

export function notification(
  body: GreenApiNotification['body'],
  receiptId = 1,
): GreenApiNotification {
  return { receiptId, body };
}
