import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('Página de Política de Privacidade', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/privacidade');
  });

  it('abre direto pela URL, sem exigir login', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /política de privacidade/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /quais dados coletamos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /como excluir a conta/i })).toBeInTheDocument();
    // nenhuma redirecionamento para login
    expect(window.location.pathname).toBe('/privacidade');
  });

  it('informa a data de atualização e os serviços externos', () => {
    render(<App />);
    expect(screen.getAllByText(/última atualização/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vercel/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Render/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Neon/).length).toBeGreaterThan(0);
  });

  it('chega na página pelo link do cadastro', () => {
    window.history.pushState({}, '', '/cadastro');
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: /política de privacidade/i }));
    expect(window.location.pathname).toBe('/privacidade');
    expect(
      screen.getByRole('heading', { level: 1, name: /política de privacidade/i }),
    ).toBeInTheDocument();
  });
});
