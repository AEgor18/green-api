import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithStore } from '@/test/render';

import { NewChatDialog } from './new-chat-dialog';

async function openDialog() {
  const view = renderWithStore(<NewChatDialog />);
  await view.user.click(screen.getByRole('button', { name: 'Новый чат' }));
  return view;
}

describe('NewChatDialog', () => {
  it('открывает чат по номеру и закрывается', async () => {
    const { user, store } = await openDialog();

    await user.type(screen.getByLabelText('Телефон'), '8 (900) 123-45-67');
    await user.type(screen.getByLabelText('Имя (необязательно)'), 'Иван');
    await user.click(screen.getByRole('button', { name: 'Открыть чат' }));

    expect(store.getState().chat.activeChatId).toBe('79001234567@c.us');
    expect(store.getState().chat.entities['79001234567@c.us']?.name).toBe('Иван');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('проверяет номер', async () => {
    const { user, store } = await openDialog();

    await user.type(screen.getByLabelText('Телефон'), '12345');
    await user.click(screen.getByRole('button', { name: 'Открыть чат' }));

    expect(await screen.findByText(/Нужен номер с кодом страны/)).toBeInTheDocument();
    expect(store.getState().chat.activeChatId).toBeNull();
  });
});
