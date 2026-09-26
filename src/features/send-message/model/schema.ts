import { z } from 'zod';

import { MAX_MESSAGE_LENGTH } from '@/shared/config';

export const messageSchema = z.object({
  text: z
    .string()
    .refine((text) => text.trim().length > 0, 'Пустое сообщение')
    .refine(
      (text) => text.length <= MAX_MESSAGE_LENGTH,
      `Не длиннее ${MAX_MESSAGE_LENGTH.toLocaleString('ru-RU')} символов`,
    ),
});
