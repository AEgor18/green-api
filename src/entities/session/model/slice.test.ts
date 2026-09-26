import { describe, expect, it } from 'vitest';

import { TEST_CREDENTIALS } from '@/test/msw/fixtures';

import { loggedIn, loggedOut, sessionRestored, sessionSlice } from './slice';

const reducer = sessionSlice.reducer;
const init = reducer(undefined, { type: '@@init' });

describe('sessionSlice', () => {
  it('до восстановления сессия не определена', () => {
    expect(init).toEqual({ credentials: null, restored: false });
  });

  it('sessionRestored отмечает, что хранилище прочитано', () => {
    expect(reducer(init, sessionRestored(null))).toEqual({ credentials: null, restored: true });
  });

  it('loggedIn / loggedOut', () => {
    const authorized = reducer(init, loggedIn(TEST_CREDENTIALS));
    expect(authorized.credentials).toEqual(TEST_CREDENTIALS);

    expect(reducer(authorized, loggedOut()).credentials).toBeNull();
  });
});
