function safely<T>(action: () => T, fallback: T): T {
  try {
    return action();
  } catch {
    return fallback;
  }
}

export const storage = {
  get<T>(key: string): T | null {
    return safely(() => {
      const raw = globalThis.localStorage?.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    }, null);
  },

  set(key: string, value: unknown): void {
    safely(() => globalThis.localStorage?.setItem(key, JSON.stringify(value)), undefined);
  },

  remove(key: string): void {
    safely(() => globalThis.localStorage?.removeItem(key), undefined);
  },
};
