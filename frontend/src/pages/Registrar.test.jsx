import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe('tela de Registrar sono', () => {
  let fetchMock;
  let posts;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'jwt-123');
    posts = [];
    vi.restoreAllMocks();
    fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options = {}) => {
      if (options.method === 'POST') {
        const body = JSON.parse(options.body);
        posts.push(body);
        return jsonResponse({ id: 'novo-id', ...body }, 201);
      }
      return jsonResponse({ content: [], totalElements: 0 });
    });
  });

  function openScreen() {
    window.history.pushState({}, '', '/registrar');
    render(<App />);
  }

  it('preenche os padrões inteligentes (ontem à noite / hoje de manhã)', async () => {
    openScreen();
    const start = await screen.findByLabelText('Dormiu às');
    const end = screen.getByLabelText('Acordou às');
    expect(start.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(new Date(end.value).getTime()).toBeGreaterThan(new Date(start.value).getTime());
  });

  it('salva o registro e mostra nos últimos registros', async () => {
    fetchMock.mockImplementation(async (url, options = {}) => {
      if (options.method === 'POST') {
        const body = JSON.parse(options.body);
        posts.push(body);
        return jsonResponse({ id: 'novo-id', ...body }, 201);
      }
      return jsonResponse({
        content: [
          {
            id: 'novo-id',
            sleepStart: '2026-10-07T23:00:00.000Z',
            sleepEnd: '2026-10-08T07:00:00.000Z',
            quality: 4,
            notes: 'dormi bem',
          },
        ],
        totalElements: 1,
      });
    });

    openScreen();
    fireEvent.change(await screen.findByLabelText('Dormiu às'), {
      target: { value: '2026-10-07T23:00' },
    });
    fireEvent.change(screen.getByLabelText('Acordou às'), {
      target: { value: '2026-10-08T07:00' },
    });
    fireEvent.click(screen.getByTitle('4 Boa'));
    fireEvent.change(screen.getByLabelText(/Observação/), { target: { value: 'dormi bem' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar registro' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Noite registrada: 8h de sono.');
    expect(posts).toHaveLength(1);
    expect(posts[0]).toEqual({
      sleepStart: new Date('2026-10-07T23:00').toISOString(),
      sleepEnd: new Date('2026-10-08T07:00').toISOString(),
      quality: 4,
      notes: 'dormi bem',
    });
    expect(await screen.findByText(/dormi bem/)).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3)); // lista inicial, POST, lista atualizada
  });

  it('bloqueia acordar antes de dormir', async () => {
    openScreen();
    fireEvent.change(await screen.findByLabelText('Dormiu às'), {
      target: { value: '2026-10-08T08:00' },
    });
    fireEvent.change(screen.getByLabelText('Acordou às'), {
      target: { value: '2026-10-08T07:00' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar registro' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('depois de dormir');
    expect(posts).toHaveLength(0);
  });

  it('exige escolher a qualidade', async () => {
    openScreen();
    fireEvent.change(await screen.findByLabelText('Dormiu às'), {
      target: { value: '2026-10-07T23:00' },
    });
    fireEvent.change(screen.getByLabelText('Acordou às'), {
      target: { value: '2026-10-08T07:00' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar registro' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('1 a 5');
    expect(posts).toHaveLength(0);
  });

  it('mostra estado vazio quando não há registros', async () => {
    openScreen();
    expect(await screen.findByText('Nenhuma noite registrada ainda.')).toBeInTheDocument();
  });
});
