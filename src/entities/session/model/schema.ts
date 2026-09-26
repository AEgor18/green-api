import { z } from 'zod';

import { DEFAULT_API_URL } from '@/shared/config';

export const credentialsSchema = z.object({
  apiUrl: z
    .string()
    .trim()
    .min(1, 'Укажите apiUrl')
    .pipe(z.url({ protocol: /^https?$/, message: 'Некорректный URL' })),
  idInstance: z
    .string()
    .trim()
    .regex(/^\d{6,15}$/, 'idInstance состоит только из цифр'),
  apiTokenInstance: z
    .string()
    .trim()
    .min(20, 'Слишком короткий токен')
    .regex(/^[\w-]+$/, 'Токен содержит недопустимые символы'),
});

export type CredentialsFormValues = z.input<typeof credentialsSchema>;

export const defaultCredentialsValues: CredentialsFormValues = {
  apiUrl: DEFAULT_API_URL,
  idInstance: '',
  apiTokenInstance: '',
};
