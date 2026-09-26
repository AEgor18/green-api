import { describe, expect, it } from 'vitest';

import type { ChatMessage } from '@/entities/chat';

import { formatDayLabel, groupMessagesByDay } from './group-by-day';

const now = new Date(2026, 8, 26, 18, 0).getTime();
const at = (day: number, hour = 12, year = 2026) => new Date(year, 8, day, hour).getTime();

const msg = (id: string, timestamp: number): ChatMessage => ({
  id,
  chatId: 'c@c.us',
  text: id,
  direction: 'incoming',
  timestamp,
});

describe('formatDayLabel', () => {
  it.each([
    [at(26, 1), 'Сегодня'],
    [at(25, 23), 'Вчера'],
    [at(12), '12 сентября'],
    [at(12, 12, 2025), '12 сентября 2025 г.'],
  ])('%i → %s', (timestamp, label) => {
    expect(formatDayLabel(timestamp, now)).toBe(label);
  });
});

describe('groupMessagesByDay', () => {
  it('группирует подряд идущие сообщения одного дня', () => {
    const groups = groupMessagesByDay(
      [msg('a', at(25, 9)), msg('b', at(25, 10)), msg('c', at(26, 9))],
      now,
    );
    expect(groups.map((g) => [g.label, g.messages.map((m) => m.id)])).toEqual([
      ['Вчера', ['a', 'b']],
      ['Сегодня', ['c']],
    ]);
  });

  it('пустая лента → нет групп', () => {
    expect(groupMessagesByDay([], now)).toEqual([]);
  });
});
