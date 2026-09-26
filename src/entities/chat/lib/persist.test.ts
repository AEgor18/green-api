import { describe, expect, it } from 'vitest';

import type { ChatsById } from '../model/types';

import { chatsStorageKey, loadChats, saveChats } from './persist';

const chats: ChatsById = {
  'c@c.us': {
    id: 'c@c.us',
    name: null,
    unreadCount: 0,
    updatedAt: 1,
    messages: [
      {
        id: 'a',
        chatId: 'c@c.us',
        text: 'ok',
        direction: 'outgoing',
        timestamp: 1,
        status: 'read',
      },
      {
        id: 'b',
        chatId: 'c@c.us',
        text: '…',
        direction: 'outgoing',
        timestamp: 2,
        status: 'pending',
      },
    ],
  },
};

describe('persist chats', () => {
  it('история изолирована по инстансам', () => {
    saveChats('111', chats);
    expect(loadChats('111')['c@c.us']?.messages).toHaveLength(2);
    expect(loadChats('222')).toEqual({});
  });

  it('незавершённые отправки после перезагрузки становятся failed', () => {
    saveChats('111', chats);
    const statuses = loadChats('111')['c@c.us']?.messages.map((m) => m.status);
    expect(statuses).toEqual(['read', 'failed']);
  });

  it('мусор в хранилище → пустая история', () => {
    localStorage.setItem(chatsStorageKey('111'), '"oops"');
    expect(loadChats('111')).toEqual({});
  });
});
