import { act, screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { sessionRestored } from '@/entities/session';
import {
  incomingTextWebhook,
  methodUrl,
  notification,
  TEST_CREDENTIALS,
} from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import { renderWithStore } from '@/test/render';
import { makeTestStore } from '@/test/store';

import { MessengerPage } from './messenger-page';

describe('MessengerPage', () => {
  it('пока сессия не прочитана — лоадер, после чтения — экран входа', async () => {
    const { store } = renderWithStore(
      <MessengerPage />,
      makeTestStore({ credentials: null, restored: false }),
    );
    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument();

    act(() => {
      store.dispatch(sessionRestored(null));
    });

    expect(await screen.findByRole('heading', { name: 'Вход в инстанс' })).toBeInTheDocument();
  });

  it('без сессии — экран входа', () => {
    renderWithStore(<MessengerPage />, makeTestStore({ credentials: null }));
    expect(screen.getByRole('heading', { name: 'Вход в инстанс' })).toBeInTheDocument();
  });

  it('сквозной сценарий: входящее сообщение → открыть чат → ответить', async () => {
    let delivered = false;
    server.use(
      http.get(methodUrl('receiveNotification'), () =>
        HttpResponse.json(delivered ? null : notification(incomingTextWebhook(), 1)),
      ),
      http.delete(`${methodUrl('deleteNotification')}/:receiptId`, () => {
        delivered = true;
        return HttpResponse.json({ result: true });
      }),
    );
    const { user } = renderWithStore(<MessengerPage />);

    const chatList = screen.getByRole('navigation', { name: 'Список чатов' });
    const chatItem = await within(chatList).findByRole('button', { name: /Иван/ });
    expect(within(chatItem).getByLabelText('Непрочитанных: 1')).toBeInTheDocument();

    await user.click(chatItem);

    const log = screen.getByRole('log', { name: 'Сообщения' });
    expect(within(log).getByText('Привет!')).toBeInTheDocument();
    expect(within(chatItem).queryByLabelText(/Непрочитанных/)).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Сообщение'), 'И тебе привет{Enter}');

    expect(await within(log).findByText('И тебе привет')).toBeInTheDocument();
    expect(await within(log).findByLabelText('Отправлено')).toBeInTheDocument();
  });

  it('выход возвращает на экран входа', async () => {
    const { user } = renderWithStore(<MessengerPage />);
    expect(screen.getByText(`Инстанс ${TEST_CREDENTIALS.idInstance}`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Меню' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Выйти' }));

    expect(await screen.findByRole('heading', { name: 'Вход в инстанс' })).toBeInTheDocument();
  });
});
