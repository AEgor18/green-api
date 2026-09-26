import { z } from 'zod';

import { isValidPhone } from '@/shared/lib/phone';

export const newChatSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, 'Введите номер телефона')
    .refine(isValidPhone, 'Нужен номер с кодом страны, например +79001234567'),
  name: z.string().trim().max(60, 'Не длиннее 60 символов'),
});

export type NewChatFormValues = z.input<typeof newChatSchema>;
