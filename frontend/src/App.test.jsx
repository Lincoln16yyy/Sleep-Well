import { render, screen } from '@testing-library/react';
import App from './App';

test('renders layout with navigation', () => {
  render(<App />);
  expect(screen.getByText('Noite Boa')).toBeInTheDocument();
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
