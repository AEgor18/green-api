interface UnreadBadgeProps {
  count: number;
}

export function UnreadBadge({ count }: UnreadBadgeProps) {
  return (
    <span
      className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-unread px-1.5 text-xs font-medium text-white dark:text-[#111b21]"
      aria-label={`Непрочитанных: ${count}`}
    >
      {count}
    </span>
  );
}
