import { MessageSquarePlus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { DialogTrigger } from '@/shared/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

export function NewChatTrigger() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon-lg" aria-label="Новый чат">
            <MessageSquarePlus className="size-5" />
          </Button>
        </DialogTrigger>
      </TooltipTrigger>
      <TooltipContent>Новый чат</TooltipContent>
    </Tooltip>
  );
}
