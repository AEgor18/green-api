import type { ChatMessage } from '../model/types';

import { MessageStatusIcon } from './message-status-icon';

interface LastMessagePreviewProps {
  message: ChatMessage | null;
}

export function LastMessagePreview({ message }: LastMessagePreviewProps) {
  const status = message?.direction === 'outgoing' ? message.status : undefined;

  return (
    <span className="flex min-w-0 items-center gap-1 text-sm text-meta">
      {status && <MessageStatusIcon status={status} />}
      <span className="truncate">{message ? message.text : 'Нет сообщений'}</span>
    </span>
  );
}
