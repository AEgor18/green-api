import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { methodUrl, TEST_CREDENTIALS } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import { renderWithStore } from '@/test/render';
import { makeTestStore } from '@/test/store';

import { LoginForm } from './login-form';

function setup() {
  const view = renderWithStore(<LoginForm />, makeTestStore({ credentials: null }));
  const fill = async (overrides: Partial<typeof TEST_CREDENTIALS> = {}) => {
    const values = { ...TEST_CREDENTIALS, ...overrides };
    await view.user.type(screen.getByLabelText('idInstance'), values.idInstance);
    await view.user.type(screen.getByLabelText('apiTokenInstance'), values.apiTokenInstance);
    const apiUrl = screen.getByLabelText('apiUrl');
    await view.user.clear(apiUrl);
    await view.user.type(apiUrl, values.apiUrl);
    await view.user.click(screen.getByRole('button', { name: 'Войти' }));
  };
  return { ...view, fill };
}

describe('LoginForm', () => {
  it('apiUrl заполнен по умолчанию', () => {
    setup();
    expect(screen.getByLabelText('apiUrl')).toHaveValue('https://api.green-api.com');
  });

  it('показывает ошибки валидации и не ходит в API', async () => {
    const { user, store } = setup();

    await user.type(screen.getByLabelText('idInstance'), 'abc');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('idInstance состоит только из цифр')).toBeInTheDocument();
    expect(screen.getByText('Слишком короткий токен')).toBeInTheDocument();
    expect(store.getState().session.credentials).toBeNull();
  });

  it('при авторизованном инстансе выполняет вход', async () => {
    const { fill, store } = setup();

    await fill();

    await waitFor(() => {
      expect(store.getState().session.credentials).toEqual(TEST_CREDENTIALS);
    });
  });

  it('не пускает, если инстанс не привязан к телефону', async () => {
    server.use(
      http.get(methodUrl('getStateInstance'), () =>
        HttpResponse.json({ stateInstance: 'notAuthorized' }),
      ),
    );
    const { fill, store } = setup();

    await fill();

    expect(await screen.findByText(/отсканируйте QR-код/)).toBeInTheDocument();
    expect(store.getState().session.credentials).toBeNull();
  });

  it('сообщает о неверном токене', async () => {
    server.use(
      http.get(methodUrl('getStateInstance'), () => new HttpResponse(null, { status: 401 })),
    );
    const { fill } = setup();

    await fill();

    expect(await screen.findByText('Неверный idInstance или apiTokenInstance')).toBeInTheDocument();
  });

  it('токен можно показать', async () => {
    const { user } = setup();
    const token = screen.getByLabelText('apiTokenInstance');
    expect(token).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Показать токен' }));

    expect(token).toHaveAttribute('type', 'text');
  });
});
