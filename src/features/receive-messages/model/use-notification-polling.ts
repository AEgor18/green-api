'use client';

import { useEffect, useState } from 'react';

import { getErrorMessage } from '@/shared/api/green-api';
import { useAppDispatch } from '@/shared/lib/store';

import { runNotificationPolling } from './run-polling';

export function useNotificationPolling(enabled: boolean): string | null {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const controller = new AbortController();
    void runNotificationPolling(dispatch, controller.signal, {
      onSuccess: () => setError(null),
      onError: (e) => setError(getErrorMessage(e)),
    });
    return () => {
      controller.abort();
      setError(null);
    };
  }, [dispatch, enabled]);

  return error;
}
