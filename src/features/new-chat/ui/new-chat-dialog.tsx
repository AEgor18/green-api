'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

import { NewChatForm } from './new-chat-form';
import { NewChatTrigger } from './new-chat-trigger';

export function NewChatDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <NewChatTrigger />
      <DialogContent className="flex flex-col gap-6 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Новый чат</DialogTitle>
          <DialogDescription>
            Номер получателя с кодом страны. Если чат уже есть, он просто откроется.
          </DialogDescription>
        </DialogHeader>
        <NewChatForm onCreated={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
