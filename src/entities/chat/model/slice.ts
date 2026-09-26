import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ensureChat, findMessage, insertMessage, isStatusUpgrade } from './helpers';
import type { ChatMessage, ChatsById, MessageStatus } from './types';

export interface ChatState {
  entities: ChatsById;
  activeChatId: string | null;
}

interface LocalMessageRef {
  chatId: string;
  localId: string;
}

const initialState: ChatState = {
  entities: {},
  activeChatId: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    chatOpened(state, { payload }: PayloadAction<{ chatId: string; name?: string | null }>) {
      const chat = ensureChat(state.entities, payload.chatId, payload.name ?? null);
      chat.unreadCount = 0;
      state.activeChatId = chat.id;
    },

    chatClosed(state) {
      state.activeChatId = null;
    },

    messageAdded(state, { payload }: PayloadAction<{ message: ChatMessage; senderName?: string }>) {
      const { message, senderName } = payload;
      const chat = ensureChat(
        state.entities,
        message.chatId,
        senderName ?? null,
        message.timestamp,
      );
      if (chat.messages.some((m) => m.id === message.id)) {
        return;
      }
      insertMessage(chat, message);
      if (message.direction === 'incoming' && state.activeChatId !== chat.id) {
        chat.unreadCount += 1;
      }
    },

    messageSent(state, { payload }: PayloadAction<LocalMessageRef & { idMessage: string }>) {
      const { chatId, localId, idMessage } = payload;
      const chat = state.entities[chatId];
      const local = findMessage(state.entities, chatId, localId);
      if (!chat || !local) {
        return;
      }
      if (findMessage(state.entities, chatId, idMessage)) {
        chat.messages = chat.messages.filter((m) => m.id !== localId);
        return;
      }
      local.id = idMessage;
      local.status = 'sent';
    },

    messageFailed(state, { payload }: PayloadAction<LocalMessageRef>) {
      const local = findMessage(state.entities, payload.chatId, payload.localId);
      if (local) {
        local.status = 'failed';
      }
    },

    messageRetried(state, { payload }: PayloadAction<LocalMessageRef>) {
      const chat = state.entities[payload.chatId];
      const index = chat?.messages.findIndex((m) => m.id === payload.localId) ?? -1;
      if (!chat || index === -1) {
        return;
      }
      const [message] = chat.messages.splice(index, 1);
      insertMessage(chat, { ...message, status: 'pending', timestamp: Date.now() });
    },

    messageStatusChanged(
      state,
      { payload }: PayloadAction<{ chatId: string; idMessage: string; status: MessageStatus }>,
    ) {
      const message = findMessage(state.entities, payload.chatId, payload.idMessage);
      if (message && isStatusUpgrade(message.status, payload.status)) {
        message.status = payload.status;
      }
    },

    chatsRestored(state, { payload }: PayloadAction<ChatsById>) {
      state.entities = payload;
      state.activeChatId = null;
    },

    chatsCleared() {
      return initialState;
    },
  },
});

export const {
  chatOpened,
  chatClosed,
  messageAdded,
  messageSent,
  messageFailed,
  messageRetried,
  messageStatusChanged,
  chatsRestored,
  chatsCleared,
} = chatSlice.actions;
