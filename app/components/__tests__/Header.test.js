import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { usePathname } from 'next/navigation';

// Mock du hook usePathname de Next.js
jest.mock('next/navigation', () => ({
    usePathname: jest.fn()
}));

// Mock du composant AuthHeader
jest.mock('../AuthHeader', () => {
    return function MockAuthHeader() {
        return <div data-testid="auth-header">Auth Header Mock</div>;
    };
});

describe('Header Component', () => {
    it('should not render on homepage (path="/")', () => {
        // Configurer le mock pour renvoyer le chemin de la page d'accueil
        usePathname.mockReturnValue('/');

        const { container } = render(<Header />);

        // Vérifier que le contenu est vide
        expect(container.firstChild).toBeNull();

        // Vérifier que AuthHeader n'est pas rendu
        expect(screen.queryByTestId('auth-header')).not.toBeInTheDocument();
    });

    it('should render on non-homepage paths', () => {
        // Tester avec différents chemins
        const testPaths = ['/login', '/favorites', '/recipe/123'];

        testPaths.forEach(path => {
            // Configurer le mock pour renvoyer un chemin différent de "/"
            usePathname.mockReturnValue(path);

            // Réinitialiser le rendu pour chaque test
            const { unmount, container } = render(<Header />);

            // Vérifier que le header est rendu
            expect(screen.getByTestId('auth-header')).toBeInTheDocument();

            // Vérifier que le conteneur a les classes CSS attendues
            const headerContainer = container.firstChild;
            expect(headerContainer).toHaveClass('bg-gray-900');
            expect(headerContainer).toHaveClass('flex');
            expect(headerContainer).toHaveClass('justify-between');

            // Démonter le composant pour le prochain test
            unmount();
        });
    });
});