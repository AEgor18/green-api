import { afterEach, describe, expect, it, vi } from 'vitest';

import { delay, formatChatTime } from './time';

describe('formatChatTime', () => {
  const now = new Date(2026, 8, 26, 18, 0).getTime();

  it('для сегодняшних сообщений показывает время', () => {
    expect(formatChatTime(new Date(2026, 8, 26, 9, 5).getTime(), now)).toBe('09:05');
  });

  it('для старых — дату', () => {
    expect(formatChatTime(new Date(2026, 8, 20, 9, 5).getTime(), now)).toBe('20.09');
  });
});

describe('delay', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('резолвится по таймеру', async () => {
    vi.useFakeTimers();
    const done = vi.fn();
    void delay(1000).then(done);

    await vi.advanceTimersByTimeAsync(999);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toHaveBeenCalled();
  });

  it('резолвится досрочно при abort', async () => {
    const controller = new AbortController();
    const promise = delay(60_000, controller.signal);
    controller.abort();
    await expect(promise).resolves.toBeUndefined();
  });
});
