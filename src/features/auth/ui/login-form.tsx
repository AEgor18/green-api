'use client';

import { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/shared/ui/button';
import { FieldError, FieldGroup } from '@/shared/ui/field';
import { FormField } from '@/shared/ui/form-field';
import { PasswordInput } from '@/shared/ui/password-input';

import { useLogin } from '../model/use-login';

function TokenInput(props: ComponentProps<'input'>) {
  return <PasswordInput showLabel="Показать токен" hideLabel="Скрыть токен" {...props} />;
}

export function LoginForm() {
  const {
    form: {
      register,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useLogin();

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Вход в инстанс GREEN-API">
      <FieldGroup>
        <FormField
          id="idInstance"
          label="idInstance"
          inputMode="numeric"
          autoComplete="username"
          placeholder="1101000001"
          error={errors.idInstance}
          {...register('idInstance')}
        />
        <FormField
          id="apiTokenInstance"
          label="apiTokenInstance"
          component={TokenInput}
          autoComplete="current-password"
          error={errors.apiTokenInstance}
          {...register('apiTokenInstance')}
        />
        <FormField
          id="apiUrl"
          label="apiUrl"
          type="url"
          inputMode="url"
          description="Указан в личном кабинете рядом с idInstance."
          error={errors.apiUrl}
          {...register('apiUrl')}
        />
        <FieldError errors={[errors.root]} />
        <Button type="submit" size="lg" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
          {isSubmitting ? 'Проверяем инстанс…' : 'Войти'}
        </Button>
      </FieldGroup>
    </form>
  );
}
