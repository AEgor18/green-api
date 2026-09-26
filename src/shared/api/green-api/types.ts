export interface GreenApiCredentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export type InstanceState =
  'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting' | 'yellowCard';

export interface GetStateInstanceResponse {
  stateInstance: InstanceState;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface DeleteNotificationResponse {
  result: boolean;
}

export type MessageWebhookType =
  'incomingMessageReceived' | 'outgoingMessageReceived' | 'outgoingAPIMessageReceived';

export type OutgoingMessageStatus =
  'sent' | 'delivered' | 'read' | 'failed' | 'noAccount' | 'notInGroup';

export interface SenderData {
  chatId: string;
  sender: string;
  senderName?: string;
  senderContactName?: string;
  chatName?: string;
}

export interface MessageData {
  typeMessage: string;
  textMessageData?: { textMessage: string };
  extendedTextMessageData?: { text: string };
}

export interface MessageWebhook {
  typeWebhook: MessageWebhookType;
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

export interface OutgoingStatusWebhook {
  typeWebhook: 'outgoingMessageStatus';
  timestamp: number;
  chatId: string;
  idMessage: string;
  status: OutgoingMessageStatus;
}

export interface OtherWebhook {
  typeWebhook: string;
  timestamp: number;
}

export type WebhookBody = MessageWebhook | OutgoingStatusWebhook | OtherWebhook;

export interface GreenApiNotification {
  receiptId: number;
  body: WebhookBody;
}
