import type { TypedStartListening } from '@reduxjs/toolkit';
import { createListenerMiddleware } from '@reduxjs/toolkit';

import { chatsCleared, chatsRestored, loadChats, saveChats } from '@/entities/chat';
import { loggedIn, loggedOut, saveSession, sessionRestored } from '@/entities/session';

const SAVE_DEBOUNCE_MS = 300;

export const persistenceMiddleware = createListenerMiddleware();

const startListening = persistenceMiddleware.startListening as TypedStartListening<
  RootState,
  AppDispatch
>;

startListening({
  actionCreator: loggedIn,
  effect: ({ payload }, api) => {
    saveSession(payload);
    api.dispatch(chatsRestored(loadChats(payload.idInstance)));
  },
});

startListening({
  actionCreator: sessionRestored,
  effect: ({ payload }, api) => {
    if (payload) {
      api.dispatch(chatsRestored(loadChats(payload.idInstance)));
    }
  },
});

startListening({
  actionCreator: loggedOut,
  effect: (_, api) => {
    saveSession(null);
    api.dispatch(chatsCleared());
  },
});

startListening({
  predicate: (_, current, previous) => current.chat.entities !== previous.chat.entities,
  effect: async (_, api) => {
    api.cancelActiveListeners();
    await api.delay(SAVE_DEBOUNCE_MS);

    const { session, chat } = api.getState();
    if (session.credentials) {
      saveChats(session.credentials.idInstance, chat.entities);
    }
  },
});
