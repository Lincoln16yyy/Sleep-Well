import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { cancelarLembrete } from '../lib/reminder';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

class NotificationFake {
  static permission = 'granted';
  static requestPermission = vi.fn();

  constructor() {
    /* só precisa existir */
  }
}

describe('tela de Configurações', () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'jwt-123');
    vi.restoreAllMocks();
    NotificationFake.permission = 'granted';
    NotificationFake.requestPermission = vi.fn().mockResolvedValue('granted');
    window.Notification = NotificationFake;
    fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options = {}) => {
      const path = String(url);
      if (path.includes('/api/goal') && options.method === 'PUT') {
        return jsonResponse(JSON.parse(options.body));
      }
      if (path.includes('/api/me') && options.method === 'PUT') {
        return jsonResponse({ id: 'u1', email: 'ana@exemplo.com', displayName: 'Ana', ...JSON.parse(options.body) });
      }
      if (path.includes('/api/me')) {
        return jsonResponse({ id: 'u1', email: 'ana@exemplo.com', displayName: 'Ana', timezone: 'America/Sao_Paulo' });
      }
      return jsonResponse({ targetMinutes: 480, bedtime: '23:00:00', wakeTime: '07:00:00' });
    });
  });

  afterEach(() => {
    cancelarLembrete();
    delete window.Notification;
  });

  function openScreen() {
    window.history.pushState({}, '', '/configuracoes');
    render(<App />);
  }

  function calls(method, pathFragment) {
    return fetchMock.mock.calls.filter(([url, options]) => (options?.method ?? 'GET') === method && String(url).includes(pathFragment));
  }

  it('carrega a meta e o fuso da API', async () => {
    openScreen();
    expect(await screen.findByLabelText('Horas por noite (4 a 12)')).toHaveValue(8);
    expect(screen.getByLabelText('Horário de dormir')).toHaveValue('23:00');
    expect(screen.getByLabelText('Fuso horário')).toHaveValue('America/Sao_Paulo');
    expect(screen.getByText(/ana@exemplo\.com/)).toBeInTheDocument();
  });

  it('salva a nova meta', async () => {
    openScreen();
    fireEvent.change(await screen.findByLabelText('Horas por noite (4 a 12)'), { target: { value: '9' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Preferências salvas.');
    const put = calls('PUT', '/api/goal')[0];
    expect(JSON.parse(put[1].body)).toEqual({ targetMinutes: 540, bedtime: '23:00', wakeTime: '07:00' });
    expect(calls('PUT', '/api/me')).toHaveLength(0); // fuso não mudou
  });

  it('salva o fuso alterado', async () => {
    openScreen();
    fireEvent.change(await screen.findByLabelText('Fuso horário'), { target: { value: 'Europe/Lisbon' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Preferências salvas.');
    const put = calls('PUT', '/api/me')[0];
    expect(JSON.parse(put[1].body)).toEqual({ timezone: 'Europe/Lisbon' });
    await waitFor(() => expect(calls('PUT', '/api/goal')).toHaveLength(1));
  });

  it('recusa meta fora de 4 e 12 horas', async () => {
    openScreen();
    fireEvent.change(await screen.findByLabelText('Horas por noite (4 a 12)'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('entre 4 e 12 horas');
    expect(calls('PUT', '/api/goal')).toHaveLength(0);
    expect(calls('PUT', '/api/me')).toHaveLength(0);
  });

  it('sai da conta limpando a sessão', async () => {
    openScreen();
    fireEvent.click(await screen.findByRole('button', { name: 'Sair da conta' }));

    await waitFor(() => expect(window.location.pathname).toBe('/login'));
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('explica as limitações do lembrete na tela', async () => {
    openScreen();
    await screen.findByLabelText('Horas por noite (4 a 12)');

    expect(screen.getByText(/não é um alarme/i)).toBeInTheDocument();
    expect(screen.getByText(/apenas neste dispositivo/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Avisar às 23:00/ })).toBeInTheDocument();
    // permissão nunca é pedida sozinha, sem clique
    expect(NotificationFake.requestPermission).not.toHaveBeenCalled();
  });

  it('ativa o lembrete pedindo permissão só no clique', async () => {
    NotificationFake.permission = 'default';
    openScreen();

    fireEvent.click(await screen.findByRole('checkbox', { name: /Avisar às 23:00/ }));

    expect(await screen.findByRole('status')).toHaveTextContent('Lembrete armado para 23:00');
    expect(NotificationFake.requestPermission).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('noiteboa.lembrete')).toBe('1');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('não ativa o lembrete quando a notificação é negada', async () => {
    NotificationFake.permission = 'default';
    NotificationFake.requestPermission.mockResolvedValue('denied');
    openScreen();

    fireEvent.click(await screen.findByRole('checkbox', { name: /Avisar às 23:00/ }));

    expect(await screen.findByRole('status')).toHaveTextContent(/Notificação bloqueada/);
    expect(localStorage.getItem('noiteboa.lembrete')).toBeNull();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('desativa o lembrete ao desmarcar', async () => {
    localStorage.setItem('noiteboa.lembrete', '1');
    openScreen();

    const caixa = await screen.findByRole('checkbox', { name: /Avisar às 23:00/ });
    expect(caixa).toBeChecked();
    fireEvent.click(caixa);

    await waitFor(() => expect(localStorage.getItem('noiteboa.lembrete')).toBeNull());
    expect(caixa).not.toBeChecked();
  });

  it('pede o horário de dormir quando a meta não tem', async () => {
    fetchMock.mockImplementation(async (url) => {
      const path = String(url);
      if (path.includes('/api/me')) {
        return jsonResponse({ id: 'u1', email: 'ana@exemplo.com', displayName: 'Ana', timezone: 'America/Sao_Paulo' });
      }
      return jsonResponse({ targetMinutes: 480, bedtime: null, wakeTime: null });
    });
    openScreen();

    expect(await screen.findByText(/Defina o .Horário de dormir./)).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
