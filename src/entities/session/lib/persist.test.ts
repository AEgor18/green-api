import { describe, expect, it } from 'vitest';

import { TEST_CREDENTIALS } from '@/test/msw/fixtures';

import { loadSession, saveSession, SESSION_STORAGE_KEY } from './persist';

describe('persist session', () => {
  it('сохраняет и восстанавливает учётные данные', () => {
    saveSession(TEST_CREDENTIALS);
    expect(loadSession()).toEqual(TEST_CREDENTIALS);
  });

  it('logout удаляет сессию', () => {
    saveSession(TEST_CREDENTIALS);
    saveSession(null);
    expect(loadSession()).toBeNull();
  });

  it('игнорирует невалидные данные в хранилище', () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ idInstance: 'abc' }));
    expect(loadSession()).toBeNull();
  });
});
