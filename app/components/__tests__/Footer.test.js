import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('renders the footer with the correct text', () => {
    render(<Footer />);

    // Vérifie que le texte "Made with ❤️‍🔥 by Antoine Castel & Arnaud PY" est présent
    expect(screen.getByText(/Made with ❤️‍🔥 by Antoine Castel & Arnaud PY/i)).toBeInTheDocument();

    // Vérifie que l'année actuelle est affichée
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Gourmitton. Tous droits réservés.`)).toBeInTheDocument();
  });
});