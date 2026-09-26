import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { GreenApiCredentials } from '@/shared/api/green-api';

export interface SessionState {
  credentials: GreenApiCredentials | null;
  restored: boolean;
}

const initialState: SessionState = {
  credentials: null,
  restored: false,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionRestored(state, action: PayloadAction<GreenApiCredentials | null>) {
      state.credentials = action.payload;
      state.restored = true;
    },
    loggedIn(state, action: PayloadAction<GreenApiCredentials>) {
      state.credentials = action.payload;
      state.restored = true;
    },
    loggedOut(state) {
      state.credentials = null;
    },
  },
  selectors: {
    selectCredentials: (state) => state.credentials,
    selectIsAuthorized: (state) => state.credentials !== null,
    selectIsSessionRestored: (state) => state.restored,
  },
});

export const { sessionRestored, loggedIn, loggedOut } = sessionSlice.actions;
export const { selectCredentials, selectIsAuthorized, selectIsSessionRestored } =
  sessionSlice.selectors;
