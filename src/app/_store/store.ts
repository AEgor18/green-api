import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { chatSlice } from '@/entities/chat';
import { sessionSlice } from '@/entities/session';
import { greenApi } from '@/shared/api/green-api';

import { persistenceMiddleware } from './persistence';

export const rootReducer = combineSlices(greenApi, sessionSlice, chatSlice);

export type RootReducerState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootReducerState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(persistenceMiddleware.middleware).concat(greenApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
