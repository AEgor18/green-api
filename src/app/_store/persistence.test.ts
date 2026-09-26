import { afterEach, describe, expect, it, vi } from 'vitest';

import { chatOpened, chatsStorageKey, saveChats } from '@/entities/chat';
import { loadSession, loggedIn, loggedOut, sessionRestored } from '@/entities/session';
import { TEST_CHAT_ID, TEST_CREDENTIALS } from '@/test/msw/fixtures';

import { makeStore } from './store';

const savedChats = () => localStorage.getItem(chatsStorageKey(TEST_CREDENTIALS.idInstance));

describe('persistence', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('вход сохраняет сессию и поднимает историю инстанса', () => {
    saveChats(TEST_CREDENTIALS.idInstance, {
      [TEST_CHAT_ID]: {
        id: TEST_CHAT_ID,
        name: 'Иван',
        messages: [],
        unreadCount: 0,
        updatedAt: 1,
      },
    });
    const store = makeStore();

    store.dispatch(loggedIn(TEST_CREDENTIALS));

    expect(loadSession()).toEqual(TEST_CREDENTIALS);
    expect(store.getState().chat.entities[TEST_CHAT_ID]?.name).toBe('Иван');
  });

  it('восстановление сессии тоже поднимает историю', () => {
    saveChats(TEST_CREDENTIALS.idInstance, {
      [TEST_CHAT_ID]: { id: TEST_CHAT_ID, name: null, messages: [], unreadCount: 0, updatedAt: 1 },
    });
    const store = makeStore();

    store.dispatch(sessionRestored(TEST_CREDENTIALS));

    expect(Object.keys(store.getState().chat.entities)).toEqual([TEST_CHAT_ID]);
  });

  it('изменения чатов сохраняются с дебаунсом', async () => {
    vi.useFakeTimers();
    const store = makeStore();
    store.dispatch(loggedIn(TEST_CREDENTIALS));

    store.dispatch(chatOpened({ chatId: TEST_CHAT_ID }));
    expect(savedChats()).toBeNull();

    await vi.advanceTimersByTimeAsync(300);
    expect(JSON.parse(savedChats() ?? '{}')).toHaveProperty([TEST_CHAT_ID]);
  });

  it('выход очищает сессию и чаты, но не историю в хранилище', async () => {
    vi.useFakeTimers();
    const store = makeStore();
    store.dispatch(loggedIn(TEST_CREDENTIALS));
    store.dispatch(chatOpened({ chatId: TEST_CHAT_ID }));
    await vi.advanceTimersByTimeAsync(300);

    store.dispatch(loggedOut());
    await vi.advanceTimersByTimeAsync(300);

    expect(loadSession()).toBeNull();
    expect(store.getState().chat.entities).toEqual({});
    expect(savedChats()).not.toBeNull();
  });
});
