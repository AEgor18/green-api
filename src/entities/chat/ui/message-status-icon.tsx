import type { LucideIcon } from 'lucide-react';
import { Check, CheckCheck, CircleAlert, Clock3 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import type { MessageStatus } from '../model/types';

const STATUS_ICONS: Record<MessageStatus, { Icon: LucideIcon; label: string; className?: string }> =
  {
    pending: { Icon: Clock3, label: 'Отправляется', className: 'size-3.5' },
    sent: { Icon: Check, label: 'Отправлено' },
    delivered: { Icon: CheckCheck, label: 'Доставлено' },
    read: { Icon: CheckCheck, label: 'Прочитано', className: 'text-tick-read' },
    failed: { Icon: CircleAlert, label: 'Не отправлено', className: 'text-destructive' },
  };

interface MessageStatusIconProps {
  status: MessageStatus;
}

export function MessageStatusIcon({ status }: MessageStatusIconProps) {
  const { Icon, label, className } = STATUS_ICONS[status];
  return <Icon role="img" aria-label={label} className={cn('size-4 shrink-0', className)} />;
}
