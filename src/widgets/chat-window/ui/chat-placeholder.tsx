import { LockKeyhole, MessagesSquare } from 'lucide-react';

export function ChatPlaceholder() {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-4 border-b-6 border-l border-border border-b-primary bg-panel-header px-8 text-center">
      <MessagesSquare className="size-20 text-meta/50" aria-hidden />
      <h2 className="text-3xl font-light">GREEN-API Chat</h2>
      <p className="max-w-md text-sm text-meta">
        Выберите чат слева или начните новый по номеру телефона. Входящие сообщения появляются
        автоматически.
      </p>
      <p className="mt-8 flex items-center gap-1 text-xs text-meta">
        <LockKeyhole className="size-3" aria-hidden />
        Учётные данные хранятся только в этом браузере
      </p>
    </section>
  );
}
