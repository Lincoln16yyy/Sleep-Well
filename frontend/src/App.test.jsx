import { render, screen } from '@testing-library/react';
import App from './App';

test('renders layout with navigation', () => {
  render(<App />);
  // "Noite Boa" também aparece na landing; o link do nav continua único
  expect(screen.getByRole('link', { name: 'Noite Boa' })).toBeInTheDocument();
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
