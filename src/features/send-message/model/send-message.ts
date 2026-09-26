import { nanoid } from '@reduxjs/toolkit';

import { messageAdded, messageFailed, messageRetried, messageSent } from '@/entities/chat';
import { getErrorMessage, greenApi } from '@/shared/api/green-api';
import { createAppAsyncThunk } from '@/shared/lib/store';

interface OutgoingMessage {
  chatId: string;
  localId: string;
  text: string;
}

type ThunkConfig = { rejectValue: string };

async function deliver(
  dispatch: AppDispatch,
  { chatId, localId, text }: OutgoingMessage,
): Promise<string | null> {
  try {
    const { idMessage } = await dispatch(
      greenApi.endpoints.sendMessage.initiate({ chatId, message: text }, { track: false }),
    ).unwrap();
    dispatch(messageSent({ chatId, localId, idMessage }));
    return null;
  } catch (error) {
    dispatch(messageFailed({ chatId, localId }));
    return getErrorMessage(error);
  }
}

export const sendChatMessage = createAppAsyncThunk<
  void,
  { chatId: string; text: string },
  ThunkConfig
>('sendMessage/send', async ({ chatId, text }, { dispatch, rejectWithValue }) => {
  const localId = `local-${nanoid()}`;
  dispatch(
    messageAdded({
      message: {
        id: localId,
        chatId,
        text,
        direction: 'outgoing',
        timestamp: Date.now(),
        status: 'pending',
      },
    }),
  );

  const error = await deliver(dispatch, { chatId, localId, text });
  if (error) {
    return rejectWithValue(error);
  }
});

export const retryChatMessage = createAppAsyncThunk<
  void,
  { chatId: string; localId: string },
  ThunkConfig
>('sendMessage/retry', async ({ chatId, localId }, { dispatch, getState, rejectWithValue }) => {
  const message = getState().chat.entities[chatId]?.messages.find((m) => m.id === localId);
  if (message?.status !== 'failed') {
    return;
  }

  dispatch(messageRetried({ chatId, localId }));
  const error = await deliver(dispatch, { chatId, localId, text: message.text });
  if (error) {
    return rejectWithValue(error);
  }
});
