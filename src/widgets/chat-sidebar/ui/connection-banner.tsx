import { WifiOff } from 'lucide-react';

interface ConnectionBannerProps {
  error: string;
}

export function ConnectionBanner({ error }: ConnectionBannerProps) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 bg-[#ffd279] px-4 py-3 text-sm text-[#111b21]"
    >
      <WifiOff className="size-5 shrink-0" aria-hidden />
      <div>
        <p className="font-medium">Нет связи с GREEN-API</p>
        <p className="text-xs opacity-80">{error}. Повторяем попытку…</p>
      </div>
    </div>
  );
}
