import { MessageCircle } from 'lucide-react';

import { LoginForm } from '@/features/auth';

import { LoginInstructions } from './login-instructions';

export function LoginScreen() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center px-4 pb-10">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-56 bg-primary dark:bg-panel-header"
        aria-hidden
      />
      <div className="flex w-full max-w-4xl items-center gap-2 py-7 text-white">
        <MessageCircle className="size-8" aria-hidden />
        <span className="text-sm font-medium tracking-wide uppercase">GREEN-API Chat</span>
      </div>
      <div className="grid w-full max-w-4xl gap-10 rounded-lg bg-panel p-8 shadow-lg md:grid-cols-[1fr_minmax(0,360px)] md:p-14">
        <LoginInstructions />
        <LoginForm />
      </div>
    </main>
  );
}
