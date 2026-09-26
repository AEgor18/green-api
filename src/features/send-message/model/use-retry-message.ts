'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { useAppDispatch } from '@/shared/lib/store';

import { retryChatMessage } from './send-message';

export function useRetryMessage() {
  const dispatch = useAppDispatch();
  return useCallback(
    (chatId: string, localId: string) => {
      dispatch(retryChatMessage({ chatId, localId }))
        .unwrap()
        .catch((message: string) => toast.error(message));
    },
    [dispatch],
  );
}
