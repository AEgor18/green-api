import type { RootReducerState } from '@/app/_store/store';
import { makeStore } from '@/app/_store/store';
import type { GreenApiCredentials } from '@/shared/api/green-api';

import { TEST_CREDENTIALS } from './msw/fixtures';

interface TestStoreOptions {
  credentials?: GreenApiCredentials | null;
  restored?: boolean;
  chat?: RootReducerState['chat'];
}

export function makeTestStore({
  credentials = TEST_CREDENTIALS,
  restored = true,
  chat,
}: TestStoreOptions = {}) {
  return makeStore({
    session: { credentials, restored },
    ...(chat && { chat }),
  });
}
