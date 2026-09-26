'use client';

import { LogOut } from 'lucide-react';

import { loggedOut } from '@/entities/session';
import { useAppDispatch } from '@/shared/lib/store';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

export function LogoutMenuItem() {
  const dispatch = useAppDispatch();
  return (
    <DropdownMenuItem variant="destructive" onSelect={() => dispatch(loggedOut())}>
      <LogOut aria-hidden />
      Выйти
    </DropdownMenuItem>
  );
}
