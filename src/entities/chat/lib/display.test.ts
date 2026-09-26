import { describe, expect, it } from 'vitest';

import { getChatInitials, getChatTitle } from './display';

describe('display', () => {
  it('заголовок: имя или отформатированный номер', () => {
    expect(getChatTitle({ id: '79001234567@c.us', name: 'Иван' })).toBe('Иван');
    expect(getChatTitle({ id: '79001234567@c.us', name: null })).toBe('+7 900 123-45-67');
  });

  it('инициалы', () => {
    expect(getChatInitials({ name: 'иван петров сидорович' })).toBe('ИП');
    expect(getChatInitials({ name: null })).toBeNull();
  });
});
