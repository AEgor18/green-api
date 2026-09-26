'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { credentialsSchema, defaultCredentialsValues, loggedIn } from '@/entities/session';
import type { GreenApiCredentials } from '@/shared/api/green-api';
import { getErrorMessage, useLazyGetStateInstanceQuery } from '@/shared/api/green-api';
import { useAppDispatch } from '@/shared/lib/store';

import { INSTANCE_STATE_MESSAGES, USABLE_STATES } from '../lib/instance-state';

export function useLogin() {
  const dispatch = useAppDispatch();
  const [checkInstance] = useLazyGetStateInstanceQuery();
  const form = useForm({
    resolver: zodResolver(credentialsSchema),
    defaultValues: defaultCredentialsValues,
    mode: 'onTouched',
  });

  const login = async (credentials: GreenApiCredentials) => {
    try {
      const { stateInstance } = await checkInstance(credentials).unwrap();
      if (!USABLE_STATES.has(stateInstance)) {
        form.setError('root', { message: INSTANCE_STATE_MESSAGES[stateInstance] });
        return;
      }
      if (stateInstance === 'yellowCard') {
        toast.warning(INSTANCE_STATE_MESSAGES.yellowCard);
      }
      dispatch(loggedIn(credentials));
    } catch (error) {
      form.setError('root', { message: getErrorMessage(error) });
    }
  };

  return { form, onSubmit: form.handleSubmit(login) };
}
