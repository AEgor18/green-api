import { Search } from 'lucide-react';

import { Input } from '@/shared/ui/input';

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChatSearch({ value, onChange }: ChatSearchProps) {
  return (
    <div className="border-b border-border px-3 py-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-meta"
          aria-hidden
        />
        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск по имени или номеру"
          aria-label="Поиск чатов"
          className="h-9 rounded-lg border-none bg-panel-header pl-10 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
