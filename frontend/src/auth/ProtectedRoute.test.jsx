import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('rotas protegidas', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/dashboard');
  });

  it('redireciona para /login quando não há sessão', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: 'Login' });
    expect(window.location.pathname).toBe('/login');
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument();
  });

  it('libera a rota quando há token salvo', () => {
    localStorage.setItem('token', 'jwt-123');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/dashboard');
  });

  it('protege também histórico, registro e configurações', () => {
    const paths = ['/registrar', '/historico', '/configuracoes'];
    for (const path of paths) {
      localStorage.clear();
      window.history.pushState({}, '', path);
      const { unmount } = render(<App />);
      expect(window.location.pathname).toBe('/login');
      unmount();
    }
  });
});
