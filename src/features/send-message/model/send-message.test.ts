import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { methodUrl, TEST_CHAT_ID } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import { makeTestStore } from '@/test/store';

import { retryChatMessage, sendChatMessage } from './send-message';

const messagesOf = (store: ReturnType<typeof makeTestStore>) =>
  store.getState().chat.entities[TEST_CHAT_ID]?.messages ?? [];

describe('sendChatMessage', () => {
  it('сразу показывает pending, затем подменяет id на idMessage', async () => {
    const store = makeTestStore();

    const pending = store.dispatch(sendChatMessage({ chatId: TEST_CHAT_ID, text: 'Привет' }));
    expect(messagesOf(store)).toMatchObject([{ text: 'Привет', status: 'pending' }]);

    await pending.unwrap();
    expect(messagesOf(store)).toMatchObject([
      { id: 'OUT-1', text: 'Привет', status: 'sent', direction: 'outgoing' },
    ]);
  });

  it('при ошибке помечает сообщение failed и отдаёт текст ошибки', async () => {
    server.use(http.post(methodUrl('sendMessage'), () => new HttpResponse(null, { status: 401 })));
    const store = makeTestStore();

    const result = store.dispatch(sendChatMessage({ chatId: TEST_CHAT_ID, text: 'Привет' }));

    await expect(result.unwrap()).rejects.toBe('Неверный idInstance или apiTokenInstance');
    expect(messagesOf(store)[0]?.status).toBe('failed');
  });

  it('не хранит результаты мутаций в сторе', async () => {
    const store = makeTestStore();
    await store.dispatch(sendChatMessage({ chatId: TEST_CHAT_ID, text: 'a' })).unwrap();
    expect(store.getState().greenApi.mutations).toEqual({});
  });
});

describe('retryChatMessage', () => {
  it('повторно отправляет failed-сообщение', async () => {
    server.use(http.post(methodUrl('sendMessage'), () => HttpResponse.error(), { once: true }));
    const store = makeTestStore();
    await store
      .dispatch(sendChatMessage({ chatId: TEST_CHAT_ID, text: 'Привет' }))
      .unwrap()
      .catch(() => undefined);
    const failed = messagesOf(store)[0];
    expect(failed?.status).toBe('failed');

    await store.dispatch(retryChatMessage({ chatId: TEST_CHAT_ID, localId: failed!.id })).unwrap();

    expect(messagesOf(store)).toMatchObject([{ id: 'OUT-1', status: 'sent' }]);
  });

  it('игнорирует сообщения не в статусе failed', async () => {
    const store = makeTestStore();
    await store.dispatch(sendChatMessage({ chatId: TEST_CHAT_ID, text: 'a' })).unwrap();

    await store.dispatch(retryChatMessage({ chatId: TEST_CHAT_ID, localId: 'OUT-1' })).unwrap();

    expect(messagesOf(store)).toHaveLength(1);
  });
});
