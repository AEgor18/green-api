import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './_providers/providers';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'GREEN-API Chat',
  description: 'Отправка и получение сообщений WhatsApp через GREEN-API',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00a884' },
    { media: '(prefers-color-scheme: dark)', color: '#202c33' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
