import { createSelector } from '@reduxjs/toolkit';

import type { ChatState } from './slice';

interface StateWithChat {
  chat: ChatState;
}

export const selectChatEntities = (state: StateWithChat) => state.chat.entities;

export const selectActiveChatId = (state: StateWithChat) => state.chat.activeChatId;

export const selectActiveChat = (state: StateWithChat) => {
  const { activeChatId, entities } = state.chat;
  return activeChatId ? (entities[activeChatId] ?? null) : null;
};

export const selectChatList = createSelector([selectChatEntities], (entities) =>
  Object.values(entities).sort((a, b) => b.updatedAt - a.updatedAt),
);
