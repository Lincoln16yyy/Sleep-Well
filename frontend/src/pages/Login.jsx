import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const accountCreated = Boolean(location.state?.created);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.accessToken);
      navigate('/registrar');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {accountCreated && <p role="status" style={{ color: '#2FBF9B' }}>Conta criada! Faça login.</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      {error && <p role="alert" style={{ color: '#E5484D' }}>{error}</p>}
      <p>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}
