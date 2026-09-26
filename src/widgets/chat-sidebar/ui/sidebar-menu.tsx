'use client';

import { EllipsisVertical } from 'lucide-react';

import { LogoutMenuItem } from '@/features/auth';
import { ThemeMenuItem } from '@/features/toggle-theme';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface SidebarMenuProps {
  apiUrl: string;
}

export function SidebarMenu({ apiUrl }: SidebarMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Меню">
          <EllipsisVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="truncate">
          {apiUrl.replace(/^https?:\/\//, '')}
        </DropdownMenuLabel>
        <ThemeMenuItem />
        <DropdownMenuSeparator />
        <LogoutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
