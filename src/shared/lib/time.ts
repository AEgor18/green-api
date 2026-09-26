const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' });

export function formatMessageTime(timestampMs: number): string {
  return timeFormatter.format(timestampMs);
}

export function formatChatTime(timestampMs: number, now: number = Date.now()): string {
  const isToday = new Date(timestampMs).toDateString() === new Date(now).toDateString();
  return isToday ? timeFormatter.format(timestampMs) : dateFormatter.format(timestampMs);
}

export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}
