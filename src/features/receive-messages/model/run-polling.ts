import { MIN_EMPTY_POLL_INTERVAL_MS, POLL_RETRY_DELAY_MS } from '@/shared/config';
import { delay } from '@/shared/lib/time';

import { processNextNotification } from './process-notification';

export interface PollingCallbacks {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

async function pollOnce(dispatch: AppDispatch, signal: AbortSignal): Promise<boolean> {
  const step = dispatch(processNextNotification());
  const abortStep = () => step.abort();
  signal.addEventListener('abort', abortStep, { once: true });
  try {
    return await step.unwrap();
  } finally {
    signal.removeEventListener('abort', abortStep);
  }
}

export async function runNotificationPolling(
  dispatch: AppDispatch,
  signal: AbortSignal,
  { onSuccess, onError }: PollingCallbacks = {},
): Promise<void> {
  while (!signal.aborted) {
    const startedAt = Date.now();
    try {
      const received = await pollOnce(dispatch, signal);
      onSuccess?.();
      if (!received) {
        await delay(MIN_EMPTY_POLL_INTERVAL_MS - (Date.now() - startedAt), signal);
      }
    } catch (error) {
      if (signal.aborted) {
        return;
      }
      onError?.(error);
      await delay(POLL_RETRY_DELAY_MS, signal);
    }
  }
}
