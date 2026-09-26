'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { chatOpened } from '@/entities/chat';
import { phoneToChatId } from '@/shared/lib/phone';
import { useAppDispatch } from '@/shared/lib/store';
import { Button } from '@/shared/ui/button';
import { DialogFooter } from '@/shared/ui/dialog';
import { FieldGroup } from '@/shared/ui/field';
import { FormField } from '@/shared/ui/form-field';

import { newChatSchema } from '../model/schema';

interface NewChatFormProps {
  onCreated: () => void;
}

export function NewChatForm({ onCreated }: NewChatFormProps) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newChatSchema),
    defaultValues: { phone: '', name: '' },
  });

  const onSubmit = handleSubmit(({ phone, name }) => {
    dispatch(chatOpened({ chatId: phoneToChatId(phone), name: name || null }));
    onCreated();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <FormField
          id="phone"
          label="Телефон"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 900 123-45-67"
          autoFocus
          error={errors.phone}
          {...register('phone')}
        />
        <FormField
          id="name"
          label="Имя (необязательно)"
          autoComplete="off"
          error={errors.name}
          {...register('name')}
        />
      </FieldGroup>
      <DialogFooter>
        <Button type="submit">Открыть чат</Button>
      </DialogFooter>
    </form>
  );
}
