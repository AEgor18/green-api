import { cn } from '@/shared/lib/utils';

import type { ChatMessage } from '../model/types';

import { MessageMeta } from './message-meta';
import { RetryButton } from './retry-button';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: () => void;
}

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const outgoing = message.direction === 'outgoing';
  const canRetry = message.status === 'failed' && onRetry;

  return (
    <div
      className={cn('flex flex-col', outgoing ? 'items-end' : 'items-start')}
      data-testid="message"
      data-direction={message.direction}
    >
      <div
        className={cn(
          'relative max-w-[85%] rounded-lg px-2 pt-1.5 pb-2 text-[14.2px] leading-4.75 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)] sm:max-w-[65%]',
          outgoing ? 'rounded-tr-none bg-bubble-out' : 'rounded-tl-none bg-bubble-in',
        )}
      >
        <span
          className={cn(
            'wrap-break-word whitespace-pre-wrap',
            message.unsupported && 'text-meta italic',
          )}
        >
          {message.text}
        </span>
        <MessageMeta message={message} />
      </div>
      {canRetry && <RetryButton onClick={onRetry} />}
    </div>
  );
}
