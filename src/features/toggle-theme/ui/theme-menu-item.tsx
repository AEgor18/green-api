'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

export function ThemeMenuItem() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <DropdownMenuItem onSelect={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
      {isDark ? 'Светлая тема' : 'Тёмная тема'}
    </DropdownMenuItem>
  );
}
