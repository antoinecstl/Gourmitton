import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeCard from '../RecipeCard';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock next/image
jest.mock('next/image', () => {
    const MockedImage = ({ src, alt, width, height, className }) => {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                data-testid="recipe-image"
            />
        );
    };
    return MockedImage;
});

// Mock next/link
jest.mock('next/link', () => {
    const MockedLink = ({ children, href, prefetch, ...props }) => {
        // Convert boolean props to strings to avoid React warnings
        const stringifiedProps = { ...props };

        // Skip the prefetch prop entirely if it's false
        if (prefetch !== false) {
            stringifiedProps.prefetch = prefetch?.toString();
        }

        return (
            <a href={href} {...stringifiedProps} data-testid="recipe-link">
                {children}
            </a>
        );
    };
    return MockedLink;
});

// Mock fetch
global.fetch = jest.fn();

describe('RecipeCard', () => {
    const mockRecipe = {
        id: '123',
        name: 'Pasta Carbonara',
        description: 'A delicious Italian pasta dish with eggs, cheese, pancetta, and pepper.',
        image_url: 'https://example.com/pasta.jpg',
        prep_time: 15,
        cook_time: 20,
        when_to_eat: 'Dîner'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockImplementation(key => {
            if (key === 'username') return 'testuser';
            if (key === 'jwt_token') return 'fake-token';
            return null;
        });
    });

    it('renders recipe details correctly', () => {
        render(<RecipeCard recipe={mockRecipe} />);

        // Check if name and description are displayed
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
        expect(screen.getByText('A delicious Italian pasta dish with eggs, cheese, pancetta, and pepper.')).toBeInTheDocument();

        // Check if time information is displayed
        expect(screen.getByText('35 min')).toBeInTheDocument();
        expect(screen.getByText('Prép:')).toBeInTheDocument();
        expect(screen.getByText('Cuisson:')).toBeInTheDocument();

        // Check if meal time tag is displayed
        expect(screen.getByText('Dîner')).toBeInTheDocument();
    });

    it('renders recipe image when image_url is provided', () => {
        render(<RecipeCard recipe={mockRecipe} />);

        const image = screen.getByTestId('recipe-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/pasta.jpg');
        expect(image).toHaveAttribute('alt', 'Pasta Carbonara');
    });

    it('renders emoji placeholder when image_url is not provided', () => {
        const recipeWithoutImage = {
            ...mockRecipe,
            image_url: ''
        };

        render(<RecipeCard recipe={recipeWithoutImage} />);

        // Check if emoji placeholder is displayed
        expect(screen.getByText('🍽️')).toBeInTheDocument();

        // Check that no image is rendered
        expect(screen.queryByTestId('recipe-image')).not.toBeInTheDocument();
    });

    it('renders a link to the recipe detail page', () => {
        render(<RecipeCard recipe={mockRecipe} />);

        const link = screen.getByTestId('recipe-link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/recettes/123');

        // Check if the link has the correct text
        expect(screen.getByText('Voir la recette')).toBeInTheDocument();
    });

    it('does not render delete button by default', () => {
        render(<RecipeCard recipe={mockRecipe} />);

        expect(screen.queryByText('Retirer des favoris')).not.toBeInTheDocument();
    });

    it('renders delete button when deleteButton prop is true', () => {
        render(<RecipeCard recipe={mockRecipe} deleteButton={true} />);

        expect(screen.getByText('Retirer des favoris')).toBeInTheDocument();
    });

    it('calls API to remove favorite when delete button is clicked', async () => {
        // Mock successful API response
        global.fetch.mockResolvedValueOnce({
            ok: true
        });

        render(<RecipeCard recipe={mockRecipe} deleteButton={true} />);

        // Click on the delete button
        fireEvent.click(screen.getByText('Retirer des favoris'));

        // Wait for the API call to be made
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://gourmet.cours.quimerch.com/users/testuser/favorites?recipeID=123',
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer fake-token'
                    })
                })
            );
        });
    });

    it('handles API error when removing favorite', async () => {
        // Spy on console.error
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        // Mock failed API call
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<RecipeCard recipe={mockRecipe} deleteButton={true} />);

        // Click on the delete button
        fireEvent.click(screen.getByText('Retirer des favoris'));

        // Wait for the error to be logged
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Error removing favorite:', expect.any(Error));
        });

        // Restore console.error
        consoleSpy.mockRestore();
    });

    it('conditionally renders prep_time and cook_time', () => {
        const recipeWithoutTimes = {
            ...mockRecipe,
            prep_time: 0,
            cook_time: 0
        };

        const { rerender } = render(<RecipeCard recipe={recipeWithoutTimes} />);

        // With zeros, they should still display because of the conditional check
        expect(screen.getByText('0 min')).toBeInTheDocument();

        // Update with null/undefined values
        const recipeWithNullTimes = {
            ...mockRecipe,
            prep_time: null,
            cook_time: undefined
        };

        rerender(<RecipeCard recipe={recipeWithNullTimes} />);

        // When null/undefined the containers shouldn't appear
        expect(screen.queryByTitle('Temps de préparation')).not.toBeInTheDocument();
        expect(screen.queryByTitle('Temps de cuisson')).not.toBeInTheDocument();
    });
    it('updates UI after successfully removing a favorite', async () => {
        // If your component has a callback for successful deletion, mock it
        const onDeleteSuccess = jest.fn();

        // Mock successful API response
        global.fetch.mockResolvedValueOnce({
            ok: true
        });

        // Render with the callback prop
        render(
            <RecipeCard
                recipe={mockRecipe}
                deleteButton={true}
                onDeleteSuccess={onDeleteSuccess}
            />
        );

        // Click on the delete button
        fireEvent.click(screen.getByText('Retirer des favoris'));

        // Wait for callback to be called after successful deletion
        await waitFor(() => {
            expect(onDeleteSuccess).toHaveBeenCalledWith(mockRecipe.id);
        });
    });
});