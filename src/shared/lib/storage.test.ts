import { afterEach, describe, expect, it, vi } from 'vitest';

import { storage } from './storage';

describe('storage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('сохраняет и читает JSON', () => {
    storage.set('key', { a: 1 });
    expect(storage.get('key')).toEqual({ a: 1 });
  });

  it('возвращает null для отсутствующего ключа и битого JSON', () => {
    expect(storage.get('missing')).toBeNull();
    localStorage.setItem('broken', '{');
    expect(storage.get('broken')).toBeNull();
  });

  it('не падает, если хранилище недоступно', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => storage.set('key', 1)).not.toThrow();
  });

  it('удаляет ключ', () => {
    storage.set('key', 1);
    storage.remove('key');
    expect(storage.get('key')).toBeNull();
  });
});
