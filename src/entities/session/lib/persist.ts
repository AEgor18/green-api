import type { GreenApiCredentials } from '@/shared/api/green-api';
import { storage } from '@/shared/lib/storage';

import { credentialsSchema } from '../model/schema';

export const SESSION_STORAGE_KEY = 'green-chat:session';

export function loadSession(): GreenApiCredentials | null {
  const parsed = credentialsSchema.safeParse(storage.get(SESSION_STORAGE_KEY));
  return parsed.success ? parsed.data : null;
}

export function saveSession(credentials: GreenApiCredentials | null): void {
  if (credentials) {
    storage.set(SESSION_STORAGE_KEY, credentials);
  } else {
    storage.remove(SESSION_STORAGE_KEY);
  }
}
