import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function Cadastro() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('A senha precisa de pelo menos 8 caracteres.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    try {
      await api.post('/auth/register', { displayName, email, password });
      navigate('/login', { state: { created: true } });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha (mín. 8 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Criar conta</button>
      </form>
      {error && <p role="alert" style={{ color: '#E5484D' }}>{error}</p>}
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
