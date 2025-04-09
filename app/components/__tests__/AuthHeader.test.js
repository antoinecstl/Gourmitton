import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthHeader from '../AuthHeader';

// Mock des fonctions de fetch et localStorage
global.fetch = jest.fn();
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock de window.location
const mockReload = jest.fn();
delete window.location;
window.location = { reload: mockReload };

describe('AuthHeader Component', () => {
    beforeEach(() => {
        // Réinitialiser tous les mocks entre les tests
        jest.clearAllMocks();
        localStorageMock.clear();
        mockReload.mockClear();

        // Réinitialiser le mock de fetch pour chaque test
        global.fetch.mockReset();
    });

    it('should show loading state initially', async () => {
        // Définir un mock de fetch qui prend du temps à répondre
        global.fetch.mockImplementation(() => new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    ok: true,
                    json: async () => ({ username: 'TestUser' }),
                });
            }, 100);
        }));

        render(<AuthHeader />);

        // Vérifier que l'état de chargement est présent avant toute réponse
        expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });

    it('should show login button when user is not logged in', async () => {
        // Simuler un utilisateur non connecté
        localStorageMock.getItem.mockReturnValue(null);

        render(<AuthHeader />);

        // Attendre que le chargement soit terminé
        await waitFor(() => {
            expect(screen.getByText('Connexion')).toBeInTheDocument();
        });

        // Vérifier le lien de connexion
        const loginButton = screen.getByText('Connexion');
        expect(loginButton.closest('a')).toHaveAttribute('href', '/login');
    });

    it('should show username and logout button when user is logged in', async () => {
        // Simuler un utilisateur connecté
        localStorageMock.getItem.mockImplementation(key => {
            if (key === 'jwt_token') return 'fake-token';
            if (key === 'username') return 'TestUser';
            return null;
        });

        // Simuler une réponse de l'API
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ username: 'TestUser' }),
        });

        render(<AuthHeader />);

        // Attendre que les données utilisateur soient chargées
        await waitFor(() => {
            expect(screen.getByText('TestUser')).toBeInTheDocument();
        });

        // Vérifier le bouton de déconnexion
        expect(screen.getByText('Déconnexion')).toBeInTheDocument();

        // Vérifier le lien vers les favoris
        const usernameLink = screen.getByText('TestUser');
        expect(usernameLink.closest('a')).toHaveAttribute('href', '/favorites');
    });

    it('should handle logout correctly', async () => {
        // Simuler un utilisateur connecté
        localStorageMock.getItem.mockImplementation(key => {
            if (key === 'jwt_token') return 'fake-token';
            if (key === 'username') return 'TestUser';
            return null;
        });

        // Simuler une réponse de l'API
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ username: 'TestUser' }),
        });

        render(<AuthHeader />);

        // Attendre que les données utilisateur soient chargées
        await waitFor(() => {
            expect(screen.getByText('Déconnexion')).toBeInTheDocument();
        });

        // Cliquer sur le bouton de déconnexion
        fireEvent.click(screen.getByText('Déconnexion'));

        // Vérifier que les actions de déconnexion ont été effectuées
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('jwt_token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('username');
        expect(mockReload).toHaveBeenCalled();
    });

    it('should handle API error correctly', async () => {
        // Simuler un token invalide
        localStorageMock.getItem.mockImplementation(key => {
            if (key === 'jwt_token') return 'invalid-token';
            return null;
        });

        // Simuler une erreur de l'API
        global.fetch.mockResolvedValueOnce({
            ok: false,
        });

        render(<AuthHeader />);

        // Attendre que l'erreur soit traitée
        await waitFor(() => {
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('jwt_token');
        });

        // Vérifier que l'utilisateur est considéré comme déconnecté
        await waitFor(() => {
            expect(screen.getByText('Connexion')).toBeInTheDocument();
        });
    });
    it('should handle network error correctly', async () => {
        // Simuler un utilisateur connecté
        localStorageMock.getItem.mockImplementation(key => {
            if (key === 'jwt_token') return 'fake-token';
            return null;
        });

        // Simuler une erreur réseau
        global.fetch.mockImplementation(() => {
            throw new Error('Network error');
        });

        // Espionner console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(<AuthHeader />);

        // Attendre que l'erreur soit logged
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(consoleErrorSpy.mock.calls[0][0]).toBe('Error fetching user data:');
        });

        // Vérifier que l'utilisateur voit le bouton de connexion (déconnecté)
        await waitFor(() => {
            expect(screen.getByText('Déconnexion')).toBeInTheDocument();
        });

        // Nettoyer le spy
        consoleErrorSpy.mockRestore();
    });
});