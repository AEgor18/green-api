import { describe, expect, it } from 'vitest';

import { selectActiveChat, selectChatList } from './selectors';
import {
  chatClosed,
  chatOpened,
  chatsCleared,
  chatSlice,
  chatsRestored,
  messageAdded,
  messageFailed,
  messageRetried,
  messageSent,
  messageStatusChanged,
} from './slice';
import type { ChatMessage } from './types';

const reducer = chatSlice.reducer;
const init = reducer(undefined, { type: '@@init' });
const CHAT = '79001234567@c.us';

function msg(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'm1',
    chatId: CHAT,
    text: 'hi',
    direction: 'incoming',
    timestamp: 1000,
    ...overrides,
  };
}

describe('chatSlice', () => {
  it('chatOpened создаёт чат, делает его активным и сбрасывает непрочитанные', () => {
    let state = reducer(init, messageAdded({ message: msg() }));
    expect(state.entities[CHAT]?.unreadCount).toBe(1);

    state = reducer(state, chatOpened({ chatId: CHAT }));
    expect(state.activeChatId).toBe(CHAT);
    expect(state.entities[CHAT]?.unreadCount).toBe(0);
  });

  it('chatOpened не затирает существующее имя', () => {
    let state = reducer(init, chatOpened({ chatId: CHAT, name: 'Иван' }));
    state = reducer(state, chatOpened({ chatId: CHAT, name: 'Другое' }));
    expect(state.entities[CHAT]?.name).toBe('Иван');
  });

  it('messageAdded подставляет имя отправителя в безымянный чат', () => {
    let state = reducer(init, chatOpened({ chatId: CHAT }));
    state = reducer(state, messageAdded({ message: msg(), senderName: 'Иван' }));
    expect(state.entities[CHAT]?.name).toBe('Иван');
  });

  it('входящие в активный чат не считаются непрочитанными', () => {
    let state = reducer(init, chatOpened({ chatId: CHAT }));
    state = reducer(state, messageAdded({ message: msg() }));
    expect(state.entities[CHAT]?.unreadCount).toBe(0);
  });

  it('исходящие не увеличивают счётчик непрочитанных', () => {
    const state = reducer(init, messageAdded({ message: msg({ direction: 'outgoing' }) }));
    expect(state.entities[CHAT]?.unreadCount).toBe(0);
  });

  it('messageAdded игнорирует дубликаты и сортирует по времени', () => {
    let state = reducer(init, messageAdded({ message: msg({ id: 'b', timestamp: 2000 }) }));
    state = reducer(state, messageAdded({ message: msg({ id: 'a', timestamp: 1000 }) }));
    state = reducer(state, messageAdded({ message: msg({ id: 'b', timestamp: 2000 }) }));

    expect(state.entities[CHAT]?.messages.map((m) => m.id)).toEqual(['a', 'b']);
    expect(state.entities[CHAT]?.updatedAt).toBeGreaterThanOrEqual(2000);
  });

  describe('жизненный цикл исходящего сообщения', () => {
    const pending = msg({ id: 'local-1', direction: 'outgoing', status: 'pending' });
    const withPending = reducer(init, messageAdded({ message: pending }));

    it('messageSent меняет локальный id на idMessage', () => {
      const state = reducer(
        withPending,
        messageSent({ chatId: CHAT, localId: 'local-1', idMessage: 'SRV-1' }),
      );
      expect(state.entities[CHAT]?.messages).toEqual([{ ...pending, id: 'SRV-1', status: 'sent' }]);
    });

    it('messageSent убирает локальную копию, если эхо уже пришло', () => {
      let state = reducer(
        withPending,
        messageAdded({ message: msg({ id: 'SRV-1', direction: 'outgoing', status: 'sent' }) }),
      );
      state = reducer(state, messageSent({ chatId: CHAT, localId: 'local-1', idMessage: 'SRV-1' }));
      expect(state.entities[CHAT]?.messages.map((m) => m.id)).toEqual(['SRV-1']);
    });

    it('messageFailed', () => {
      const state = reducer(withPending, messageFailed({ chatId: CHAT, localId: 'local-1' }));
      expect(state.entities[CHAT]?.messages[0]?.status).toBe('failed');
    });

    it('messageRetried возвращает pending и переносит сообщение в конец', () => {
      let state = reducer(withPending, messageFailed({ chatId: CHAT, localId: 'local-1' }));
      state = reducer(state, messageAdded({ message: msg({ id: 'later', timestamp: 5000 }) }));
      state = reducer(state, messageRetried({ chatId: CHAT, localId: 'local-1' }));

      const messages = state.entities[CHAT]?.messages ?? [];
      expect(messages.map((m) => m.id)).toEqual(['later', 'local-1']);
      expect(messages[1]?.status).toBe('pending');
    });

    it('messageStatusChanged повышает статус и не понижает его', () => {
      let state = reducer(
        withPending,
        messageSent({ chatId: CHAT, localId: 'local-1', idMessage: 'SRV-1' }),
      );
      const change = (status: 'delivered' | 'read') =>
        messageStatusChanged({ chatId: CHAT, idMessage: 'SRV-1', status });

      state = reducer(state, change('read'));
      state = reducer(state, change('delivered'));
      expect(state.entities[CHAT]?.messages[0]?.status).toBe('read');
    });
  });

  it('chatClosed, chatsRestored, chatsCleared', () => {
    let state = reducer(init, chatOpened({ chatId: CHAT }));
    state = reducer(state, chatClosed());
    expect(state.activeChatId).toBeNull();

    const restored = reducer(init, chatsRestored(state.entities));
    expect(restored.entities).toEqual(state.entities);

    expect(reducer(restored, chatsCleared())).toEqual(init);
  });

  it('селекторы: список по активности и активный чат', () => {
    let state = reducer(init, messageAdded({ message: msg({ chatId: 'old@c.us', timestamp: 1 }) }));
    state = reducer(state, chatOpened({ chatId: 'new@c.us' }));
    const root = { chat: state };

    expect(selectChatList(root).map((c) => c.id)).toEqual(['new@c.us', 'old@c.us']);
    expect(selectActiveChat(root)?.id).toBe('new@c.us');
  });
});
