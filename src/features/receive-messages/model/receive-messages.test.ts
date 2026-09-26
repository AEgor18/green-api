import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { chatOpened, messageAdded } from '@/entities/chat';
import {
  incomingTextWebhook,
  methodUrl,
  notification,
  statusWebhook,
  TEST_CHAT_ID,
} from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import { makeTestStore } from '@/test/store';

import { processNextNotification } from './process-notification';
import { runNotificationPolling } from './run-polling';

function mockQueue(...items: ReturnType<typeof notification>[]) {
  const queue = [...items];
  const deleted: number[] = [];
  server.use(
    http.get(methodUrl('receiveNotification'), () => HttpResponse.json(queue[0] ?? null)),
    http.delete(`${methodUrl('deleteNotification')}/:receiptId`, ({ params }) => {
      const receiptId = Number(params.receiptId);
      deleted.push(receiptId);
      if (queue[0]?.receiptId === receiptId) {
        queue.shift();
      }
      return HttpResponse.json({ result: true });
    }),
  );
  return deleted;
}

describe('processNextNotification', () => {
  it('добавляет входящее сообщение и удаляет уведомление', async () => {
    const deleted = mockQueue(notification(incomingTextWebhook(), 11));
    const store = makeTestStore();

    await expect(store.dispatch(processNextNotification()).unwrap()).resolves.toBe(true);

    const chat = store.getState().chat.entities[TEST_CHAT_ID];
    expect(chat).toMatchObject({ name: 'Иван', unreadCount: 1 });
    expect(chat?.messages[0]).toMatchObject({ id: 'IN-1', text: 'Привет!' });
    expect(deleted).toEqual([11]);
  });

  it('обновляет статус исходящего', async () => {
    mockQueue(notification(statusWebhook({ status: 'read' }), 12));
    const store = makeTestStore();
    store.dispatch(chatOpened({ chatId: TEST_CHAT_ID }));
    store.dispatch(
      messageAdded({
        message: {
          id: 'OUT-1',
          chatId: TEST_CHAT_ID,
          text: 'hi',
          direction: 'outgoing',
          timestamp: 1,
          status: 'sent',
        },
      }),
    );

    await store.dispatch(processNextNotification()).unwrap();

    expect(store.getState().chat.entities[TEST_CHAT_ID]?.messages[0]?.status).toBe('read');
  });

  it('удаляет и неинтересные уведомления, не трогая чаты', async () => {
    const deleted = mockQueue(notification({ typeWebhook: 'incomingCall', timestamp: 1 }, 13));
    const store = makeTestStore();

    await store.dispatch(processNextNotification()).unwrap();

    expect(store.getState().chat.entities).toEqual({});
    expect(deleted).toEqual([13]);
  });

  it('пустая очередь → false', async () => {
    const store = makeTestStore();
    await expect(store.dispatch(processNextNotification()).unwrap()).resolves.toBe(false);
  });
});

describe('runNotificationPolling', () => {
  it('разбирает очередь, пока не остановят', async () => {
    mockQueue(
      notification(incomingTextWebhook({ idMessage: 'A' }), 1),
      notification(incomingTextWebhook({ idMessage: 'B' }), 2),
    );
    const store = makeTestStore();
    const controller = new AbortController();

    const loop = runNotificationPolling(store.dispatch, controller.signal);
    await vi.waitFor(() => {
      expect(store.getState().chat.entities[TEST_CHAT_ID]?.messages).toHaveLength(2);
    });
    controller.abort();

    await expect(loop).resolves.toBeUndefined();
  });

  it('мгновенные пустые ответы не превращаются в холостой цикл', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    let calls = 0;
    server.use(
      http.get(methodUrl('receiveNotification'), () => {
        calls += 1;
        return HttpResponse.json(null);
      }),
    );
    const store = makeTestStore();
    const controller = new AbortController();

    const loop = runNotificationPolling(store.dispatch, controller.signal);
    await vi.advanceTimersByTimeAsync(2_500);
    controller.abort();
    await loop;
    vi.useRealTimers();

    expect(calls).toBeLessThanOrEqual(4);
  });

  it('сообщает об ошибке, ждёт и восстанавливается', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    server.use(
      http.get(methodUrl('receiveNotification'), () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
    );
    const store = makeTestStore();
    const controller = new AbortController();
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const loop = runNotificationPolling(store.dispatch, controller.signal, { onError, onSuccess });
    await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onSuccess).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(5_000);
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled());

    controller.abort();
    await loop;
    vi.useRealTimers();
  });
});
