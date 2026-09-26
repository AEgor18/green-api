import { describe, expect, it } from 'vitest';

import { chatIdToPhone, formatPhone, isValidPhone, normalizePhone, phoneToChatId } from './phone';

describe('normalizePhone', () => {
  it('убирает всё, кроме цифр', () => {
    expect(normalizePhone('+7 (900) 123-45-67')).toBe('79001234567');
  });

  it('заменяет российскую 8 на 7', () => {
    expect(normalizePhone('8 900 123 45 67')).toBe('79001234567');
  });

  it('не трогает 8 в номерах другой длины', () => {
    expect(normalizePhone('880012345678')).toBe('880012345678');
  });
});

describe('isValidPhone', () => {
  it.each(['+79001234567', '89001234567', '+44 20 7946 0958', '4915123456789'])(
    'принимает %s',
    (phone) => {
      expect(isValidPhone(phone)).toBe(true);
    },
  );

  it.each(['', '12345', '0123456789', '1234567890123456', 'abc'])('отклоняет «%s»', (phone) => {
    expect(isValidPhone(phone)).toBe(false);
  });
});

describe('chatId', () => {
  it('строит chatId личного чата', () => {
    expect(phoneToChatId('+7 900 123-45-67')).toBe('79001234567@c.us');
  });

  it('достаёт номер из chatId', () => {
    expect(chatIdToPhone('79001234567@c.us')).toBe('79001234567');
  });
});

describe('formatPhone', () => {
  it('форматирует российский номер', () => {
    expect(formatPhone('79001234567')).toBe('+7 900 123-45-67');
  });

  it('прочие номера — с плюсом', () => {
    expect(formatPhone('442079460958')).toBe('+442079460958');
  });
});
