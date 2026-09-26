import { RotateCw } from 'lucide-react';

interface RetryButtonProps {
  onClick: () => void;
}

export function RetryButton({ onClick }: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 flex items-center gap-1 text-xs text-destructive hover:underline"
    >
      <RotateCw className="size-3" aria-hidden />
      Не отправлено. Повторить
    </button>
  );
}
