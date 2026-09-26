import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import {
  methodUrl,
  notification,
  incomingTextWebhook,
  TEST_CREDENTIALS,
} from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';

import { buildMethodUrl } from './base-query';
import { getErrorMessage } from './errors';
import { greenApi } from './green-api';
import type { GreenApiCredentials } from './types';

function setup(credentials: GreenApiCredentials | null = TEST_CREDENTIALS) {
  const reducer = combineSlices(greenApi, {
    session: (state: { credentials: GreenApiCredentials | null } = { credentials }) => state,
  });
  return configureStore({
    reducer,
    middleware: (gDM) => gDM().concat(greenApi.middleware),
  });
}

describe('buildMethodUrl', () => {
  it('собирает URL метода и убирает лишний слэш у apiUrl', () => {
    expect(buildMethodUrl({ ...TEST_CREDENTIALS, apiUrl: 'https://host/' }, 'sendMessage')).toBe(
      `https://host/waInstance${TEST_CREDENTIALS.idInstance}/sendMessage/${TEST_CREDENTIALS.apiTokenInstance}`,
    );
  });

  it('добавляет параметр пути', () => {
    expect(buildMethodUrl(TEST_CREDENTIALS, 'deleteNotification', 42)).toMatch(
      /\/deleteNotification\/test-token-0123456789abcdef\/42$/,
    );
  });
});

describe('greenApi', () => {
  it('sendMessage отправляет chatId и текст из сессии', async () => {
    let body: unknown;
    server.use(
      http.post(methodUrl('sendMessage'), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ idMessage: 'ABC' });
      }),
    );
    const store = setup();

    const result = await store
      .dispatch(greenApi.endpoints.sendMessage.initiate({ chatId: '7@c.us', message: 'hi' }))
      .unwrap();

    expect(result).toEqual({ idMessage: 'ABC' });
    expect(body).toEqual({ chatId: '7@c.us', message: 'hi' });
  });

  it('receiveNotification передаёт receiveTimeout и возвращает null на пустой очереди', async () => {
    let timeout: string | null = null;
    server.use(
      http.get(methodUrl('receiveNotification'), ({ request }) => {
        timeout = new URL(request.url).searchParams.get('receiveTimeout');
        return HttpResponse.json(null);
      }),
    );
    const store = setup();

    const result = await store.dispatch(greenApi.endpoints.receiveNotification.initiate()).unwrap();

    expect(result).toBeNull();
    expect(timeout).toBe('5');
  });

  it('receiveNotification возвращает уведомление', async () => {
    const payload = notification(incomingTextWebhook(), 7);
    server.use(http.get(methodUrl('receiveNotification'), () => HttpResponse.json(payload)));
    const store = setup();

    await expect(
      store.dispatch(greenApi.endpoints.receiveNotification.initiate()).unwrap(),
    ).resolves.toEqual(payload);
  });

  it('deleteNotification кладёт receiptId в путь', async () => {
    let receiptId: unknown;
    server.use(
      http.delete(`${methodUrl('deleteNotification')}/:receiptId`, ({ params }) => {
        receiptId = params.receiptId;
        return HttpResponse.json({ result: true });
      }),
    );
    const store = setup();

    await store.dispatch(greenApi.endpoints.deleteNotification.initiate(7)).unwrap();

    expect(receiptId).toBe('7');
  });

  it('getStateInstance использует явные учётные данные, даже если сессии нет', async () => {
    const store = setup(null);

    const result = await store
      .dispatch(greenApi.endpoints.getStateInstance.initiate(TEST_CREDENTIALS))
      .unwrap();

    expect(result.stateInstance).toBe('authorized');
  });

  it('без учётных данных возвращает понятную ошибку, не делая запрос', async () => {
    const store = setup(null);

    const error = await store
      .dispatch(greenApi.endpoints.sendMessage.initiate({ chatId: '7@c.us', message: 'hi' }))
      .unwrap()
      .catch((e: unknown) => e);

    expect(getErrorMessage(error)).toBe('Не выполнен вход в инстанс');
  });
});

describe('getErrorMessage', () => {
  it.each([
    [{ status: 401, data: null }, 'Неверный idInstance или apiTokenInstance'],
    [{ status: 429, data: null }, 'Слишком много запросов, попробуйте позже'],
    [{ status: 502, data: null }, 'Сервер GREEN-API временно недоступен'],
    [
      { status: 'FETCH_ERROR', error: 'x' },
      'Нет соединения с GREEN-API. Проверьте apiUrl и интернет',
    ],
    [new Error('boom'), 'boom'],
    ['???', 'Неизвестная ошибка'],
  ])('%j → %s', (error, message) => {
    expect(getErrorMessage(error)).toBe(message);
  });
});
