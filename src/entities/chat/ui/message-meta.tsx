import { formatMessageTime } from '@/shared/lib/time';

import type { ChatMessage } from '../model/types';

import { MessageStatusIcon } from './message-status-icon';

interface MessageMetaProps {
  message: ChatMessage;
}

export function MessageMeta({ message }: MessageMetaProps) {
  const status = message.direction === 'outgoing' ? message.status : undefined;

  return (
    <>
      <span className="invisible inline-block w-16" aria-hidden />
      <span className="absolute right-2 bottom-1 flex items-center gap-1 text-[11px] text-meta">
        <time dateTime={new Date(message.timestamp).toISOString()}>
          {formatMessageTime(message.timestamp)}
        </time>
        {status && <MessageStatusIcon status={status} />}
      </span>
    </>
  );
}
