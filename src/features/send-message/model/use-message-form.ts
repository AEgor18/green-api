'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { useAppDispatch } from '@/shared/lib/store';

import { messageSchema } from './schema';
import { sendChatMessage } from './send-message';

export function useMessageForm(chatId: string) {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset, control, setFocus, formState } = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: '' },
  });
  const canSend = useWatch({ control, name: 'text' }).trim().length > 0;

  const onSubmit = handleSubmit(({ text }) => {
    reset();
    setFocus('text');
    dispatch(sendChatMessage({ chatId, text: text.trim() }))
      .unwrap()
      .catch((message: string) => toast.error(message));
  });

  const error = canSend ? formState.errors.text?.message : undefined;

  return { register, onSubmit, canSend, error };
}
