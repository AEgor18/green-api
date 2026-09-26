'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { loadSession, sessionRestored } from '@/entities/session';
import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

import { makeStore } from '../_store/store';

export function Providers({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(sessionRestored(loadSession()));
  }, [store]);

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider delayDuration={400}>
          {children}
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
}
