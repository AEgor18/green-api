import { describe, expect, it } from 'vitest';

import { incomingTextWebhook, statusWebhook, TEST_CHAT_ID } from '@/test/msw/fixtures';

import { webhookToChatEvent } from './webhook';

describe('webhookToChatEvent', () => {
  it('входящее текстовое сообщение', () => {
    expect(webhookToChatEvent(incomingTextWebhook())).toEqual({
      type: 'message',
      senderName: 'Иван',
      message: {
        id: 'IN-1',
        chatId: TEST_CHAT_ID,
        text: 'Привет!',
        direction: 'incoming',
        timestamp: 1_758_880_000_000,
        status: undefined,
      },
    });
  });

  it('extendedTextMessage (текст со ссылкой)', () => {
    const event = webhookToChatEvent(
      incomingTextWebhook({
        messageData: {
          typeMessage: 'extendedTextMessage',
          extendedTextMessageData: { text: 'https://green-api.com' },
        },
      }),
    );
    expect(event?.type === 'message' && event.message.text).toBe('https://green-api.com');
  });

  it('имя контакта из телефонной книги важнее имени профиля', () => {
    const event = webhookToChatEvent(
      incomingTextWebhook({
        senderData: {
          chatId: TEST_CHAT_ID,
          sender: TEST_CHAT_ID,
          senderName: 'ivan_profile',
          senderContactName: 'Иван Петров',
        },
      }),
    );
    expect(event?.type === 'message' && event.senderName).toBe('Иван Петров');
  });

  it('медиа превращается в заглушку', () => {
    const event = webhookToChatEvent(
      incomingTextWebhook({ messageData: { typeMessage: 'imageMessage' } }),
    );
    expect(event?.type === 'message' && event.message).toMatchObject({
      text: 'Фото',
      unsupported: true,
    });
  });

  it('сообщение, отправленное с телефона, — исходящее', () => {
    const event = webhookToChatEvent(
      incomingTextWebhook({ typeWebhook: 'outgoingMessageReceived' }),
    );
    expect(event?.type === 'message' && event.message).toMatchObject({
      direction: 'outgoing',
      status: 'sent',
    });
    expect(event?.type === 'message' && event.senderName).toBeUndefined();
  });

  it.each([
    ['delivered', 'delivered'],
    ['read', 'read'],
    ['noAccount', 'failed'],
  ] as const)('статус %s → %s', (status, expected) => {
    expect(webhookToChatEvent(statusWebhook({ status }))).toEqual({
      type: 'status',
      chatId: TEST_CHAT_ID,
      idMessage: 'OUT-1',
      status: expected,
    });
  });

  it('прочие уведомления пропускаются', () => {
    expect(webhookToChatEvent({ typeWebhook: 'stateInstanceChanged', timestamp: 1 })).toBeNull();
  });
});
