import React from 'react';
import { render, screen } from '@testing-library/react';
import MostLikedRecipe from '../MostLikedRecipe';

// Mock next/image
jest.mock('next/image', () => {
    const MockedImage = (props) => {
        // Convert any non-string props
        const stringifiedProps = { ...props };
        if (typeof stringifiedProps.width === 'number') {
            stringifiedProps.width = stringifiedProps.width.toString();
        }
        if (typeof stringifiedProps.height === 'number') {
            stringifiedProps.height = stringifiedProps.height.toString();
        }

        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...stringifiedProps} data-testid="recipe-image" />;
    };
    MockedImage.displayName = 'MockedImage';
    return MockedImage;
});

// More comprehensive next/link mock
jest.mock('next/link', () => {
    const MockedLink = ({ children, href, ...props }) => {
        // Convert all boolean props to strings
        const stringifiedProps = {};
        Object.entries(props).forEach(([key, value]) => {
            // Skip undefined/null values
            if (value === undefined || value === null) {
                return;
            }

            // Convert booleans to strings
            if (typeof value === 'boolean') {
                if (value) {
                    stringifiedProps[key] = 'true';
                }
                // Omit false boolean props
            } else {
                stringifiedProps[key] = value;
            }
        });

        return (
            <a href={href} {...stringifiedProps}>
                {children}
            </a>
        );
    };
    MockedLink.displayName = 'MockedLink';
    return MockedLink;
});

describe('MostLikedRecipe', () => {
    const mockRecipe = {
        id: '123',
        name: 'Pasta Carbonara',
        description: 'A delicious Italian pasta dish with eggs, cheese, pancetta, and pepper.',
        image_url: 'https://example.com/pasta.jpg',
        prep_time: 15,
        cook_time: 20,
        when_to_eat: 'Dîner'
    };

    it('renders recipe details correctly', () => {
        render(<MostLikedRecipe recipe={mockRecipe} />);

        // Check if name is displayed
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();

        // Check if description is displayed
        expect(screen.getByText('A delicious Italian pasta dish with eggs, cheese, pancetta, and pepper.')).toBeInTheDocument();

        // Check if meal time is displayed
        expect(screen.getByText('Dîner')).toBeInTheDocument();

        // Check if prep and cook times are displayed
        expect(screen.getByText('Préparation: 15 min')).toBeInTheDocument();
        expect(screen.getByText('Cuisson: 20 min')).toBeInTheDocument();

        // Check if total time is displayed
        expect(screen.getByText('35 min')).toBeInTheDocument();
    });

    it('renders recipe image when image_url is provided', () => {
        render(<MostLikedRecipe recipe={mockRecipe} />);

        const image = screen.getByTestId('recipe-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/pasta.jpg');
        expect(image).toHaveAttribute('alt', 'Pasta Carbonara');
    });

    it('renders fallback when image_url is not provided', () => {
        const recipeWithoutImage = {
            ...mockRecipe,
            image_url: ''
        };

        render(<MostLikedRecipe recipe={recipeWithoutImage} />);

        // Should show emoji placeholder instead of image
        expect(screen.getByText('🍽️')).toBeInTheDocument();

        // Image should not be rendered
        expect(screen.queryByTestId('recipe-image')).not.toBeInTheDocument();
    });

    it('renders a link to the recipe detail page', () => {
        render(<MostLikedRecipe recipe={mockRecipe} />);

        const link = screen.getByRole('link', { name: 'Voir la recette' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/recettes/123');
    });

    it('returns null when recipe is not provided', () => {
        const { container } = render(<MostLikedRecipe recipe={null} />);
        expect(container).toBeEmptyDOMElement();
    });
});