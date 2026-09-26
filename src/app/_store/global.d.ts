import type { AppStore, RootReducerState } from './store';

declare global {
  type RootState = RootReducerState;
  type AppDispatch = AppStore['dispatch'];
}
