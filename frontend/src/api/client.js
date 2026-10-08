const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function getToken() {
  return localStorage.getItem('token');
}

export function clearSession() {
  localStorage.removeItem('token');
}

async function readProblemMessage(response) {
  try {
    const problem = await response.json();
    if (problem.detail) return problem.detail;
    if (problem.title) return problem.title;
  } catch {
    // corpo não é ProblemDetail: mantém mensagem genérica
  }
  return '';
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const message = await readProblemMessage(response);

    // 401 com sessão ativa = token expirado/inválido: limpa e volta pro login.
    // 401 sem sessão = falha de autenticação (ex.: senha errada): só mostra o erro.
    const hadSession = Boolean(getToken());
    if (response.status === 401 && hadSession) {
      clearSession();
      window.location.href = '/login';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    throw new Error(message || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
