'use client';

import { selectIsAuthorized, selectIsSessionRestored } from '@/entities/session';
import { useAppSelector } from '@/shared/lib/store';

import { LoginScreen } from './login-screen';
import { Messenger } from './messenger';
import { PageLoader } from './page-loader';

export function MessengerPage() {
  const restored = useAppSelector(selectIsSessionRestored);
  const authorized = useAppSelector(selectIsAuthorized);

  if (!restored) {
    return <PageLoader />;
  }
  return authorized ? <Messenger /> : <LoginScreen />;
}
