import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';

import { TooltipProvider } from '@/shared/ui/tooltip';

import { makeTestStore } from './store';

type TestStore = ReturnType<typeof makeTestStore>;

export function renderWithStore(ui: ReactElement, store: TestStore = makeTestStore()) {
  const user = userEvent.setup();
  const result = render(
    <Provider store={store}>
      <TooltipProvider>{ui}</TooltipProvider>
    </Provider>,
  );
  return { ...result, store, user };
}
