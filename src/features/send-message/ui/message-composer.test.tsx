import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TEST_CHAT_ID } from '@/test/msw/fixtures';
import { renderWithStore } from '@/test/render';

import { MessageComposer } from './message-composer';

const messagesOf = (store: ReturnType<typeof renderWithStore>['store']) =>
  store.getState().chat.entities[TEST_CHAT_ID]?.messages ?? [];

describe('MessageComposer', () => {
  it('кнопка неактивна, пока поле пустое или из пробелов', async () => {
    const { user } = renderWithStore(<MessageComposer chatId={TEST_CHAT_ID} />);
    const send = screen.getByRole('button', { name: 'Отправить' });
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText('Сообщение'), '   ');
    expect(send).toBeDisabled();
  });

  it('Enter отправляет и очищает поле', async () => {
    const { user, store } = renderWithStore(<MessageComposer chatId={TEST_CHAT_ID} />);
    const input = screen.getByLabelText('Сообщение');

    await user.type(input, '  Привет  {Enter}');

    expect(input).toHaveValue('');
    await waitFor(() => {
      expect(messagesOf(store)).toMatchObject([{ text: 'Привет', status: 'sent' }]);
    });
  });

  it('Shift+Enter переносит строку', async () => {
    const { user, store } = renderWithStore(<MessageComposer chatId={TEST_CHAT_ID} />);
    const input = screen.getByLabelText('Сообщение');

    await user.type(input, 'строка 1{Shift>}{Enter}{/Shift}строка 2');
    expect(messagesOf(store)).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: 'Отправить' }));
    await waitFor(() => expect(messagesOf(store)[0]?.text).toBe('строка 1\nстрока 2'));
  });
});
