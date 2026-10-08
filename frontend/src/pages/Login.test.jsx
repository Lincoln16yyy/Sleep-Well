import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import Login from './Login';

describe('tela de Login', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('guarda o token e segue para /registrar no login com sucesso', async () => {
    window.history.pushState({}, '', '/login');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ accessToken: 'jwt-123' }), { status: 200 }),
    );

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'ana@exemplo.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(window.location.pathname).toBe('/registrar'));
    expect(localStorage.getItem('token')).toBe('jwt-123');
  });

  it('mostra a mensagem da API quando as credenciais são inválidas', async () => {
    window.history.pushState({}, '', '/login');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Credenciais inválidas' }), { status: 401 }),
    );

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'ana@exemplo.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senhaerrada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciais inválidas');
    expect(window.location.pathname).toBe('/login');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('avisa que a conta foi criada quando vem do cadastro', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/login', state: { created: true } }]}>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Conta criada! Faça login.');
  });
});
