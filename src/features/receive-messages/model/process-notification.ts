import type { ChatEvent } from '@/entities/chat';
import { messageAdded, messageStatusChanged, webhookToChatEvent } from '@/entities/chat';
import { greenApi } from '@/shared/api/green-api';
import { createAppAsyncThunk } from '@/shared/lib/store';

function applyChatEvent(dispatch: AppDispatch, event: ChatEvent | null): void {
  if (event?.type === 'message') {
    dispatch(messageAdded({ message: event.message, senderName: event.senderName }));
  } else if (event?.type === 'status') {
    dispatch(messageStatusChanged(event));
  }
}

export const processNextNotification = createAppAsyncThunk(
  'receiveMessages/processNext',
  async (_, { dispatch, signal }) => {
    const request = dispatch(
      greenApi.endpoints.receiveNotification.initiate(undefined, { track: false }),
    );
    signal.addEventListener('abort', () => request.abort(), { once: true });

    const notification = await request.unwrap();
    if (!notification) {
      return false;
    }

    applyChatEvent(dispatch, webhookToChatEvent(notification.body));
    await dispatch(
      greenApi.endpoints.deleteNotification.initiate(notification.receiptId, { track: false }),
    ).unwrap();
    return true;
  },
);
