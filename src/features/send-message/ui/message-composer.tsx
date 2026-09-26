'use client';

import { SendHorizontal } from 'lucide-react';

import { submitOnEnter } from '@/shared/lib/keyboard';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

import { useMessageForm } from '../model/use-message-form';

interface MessageComposerProps {
  chatId: string;
}

export function MessageComposer({ chatId }: MessageComposerProps) {
  const { register, onSubmit, canSend, error } = useMessageForm(chatId);

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-end gap-2 bg-panel-header px-4 py-2.5"
      aria-label="Отправка сообщения"
    >
      <div className="flex-1">
        <Textarea
          rows={1}
          placeholder="Введите сообщение"
          aria-label="Сообщение"
          aria-invalid={!!error}
          onKeyDown={submitOnEnter(onSubmit)}
          className="max-h-32 min-h-10 resize-none rounded-lg border-none bg-panel px-3 py-2.5 text-[15px] shadow-none focus-visible:ring-0"
          {...register('text')}
        />
        {error && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
      <Button
        type="submit"
        size="icon-lg"
        variant="ghost"
        className="size-10 text-meta hover:text-primary"
        disabled={!canSend}
        aria-label="Отправить"
      >
        <SendHorizontal className="size-6" />
      </Button>
    </form>
  );
}
