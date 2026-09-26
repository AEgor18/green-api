import { describe, expect, it } from 'vitest';

import type { Chat } from '@/entities/chat';

import { filterChats } from './filter-chats';

const chat = (id: string, name: string | null): Chat => ({
  id,
  name,
  messages: [],
  unreadCount: 0,
  updatedAt: 0,
});

const chats = [chat('79001234567@c.us', 'Иван Петров'), chat('79261112233@c.us', null)];

describe('filterChats', () => {
  it('пустой запрос возвращает все чаты', () => {
    expect(filterChats(chats, '  ')).toBe(chats);
  });

  it('ищет по имени без учёта регистра', () => {
    expect(filterChats(chats, 'петр').map((c) => c.name)).toEqual(['Иван Петров']);
  });

  it('ищет по цифрам номера в любом формате', () => {
    expect(filterChats(chats, '926 111').map((c) => c.id)).toEqual(['79261112233@c.us']);
  });

  it('ничего не находит', () => {
    expect(filterChats(chats, 'мария')).toEqual([]);
  });
});
