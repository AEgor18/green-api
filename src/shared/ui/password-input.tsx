'use client';

import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import { cn } from '@/shared/lib/utils';

import { Button } from './button';
import { Input } from './input';

interface PasswordInputProps extends ComponentProps<'input'> {
  showLabel?: string;
  hideLabel?: string;
}

export function PasswordInput({
  className,
  showLabel = 'Показать',
  hideLabel = 'Скрыть',
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className={cn('pr-9', className)} />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-1/2 right-0.5 -translate-y-1/2 text-muted-foreground"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
