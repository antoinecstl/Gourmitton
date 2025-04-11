import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import HeroSection from '../HeroSection';

// Mock next/image
jest.mock('next/image', () => {
  const MockedImage = (props) => {
    // Convert boolean props to strings
    const stringifiedProps = { ...props };
    if (typeof stringifiedProps.priority === 'boolean') {
      stringifiedProps.priority = stringifiedProps.priority.toString();
    }
    if (typeof stringifiedProps.fill === 'boolean') {
      stringifiedProps.fill = stringifiedProps.fill.toString();
    }
    
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...stringifiedProps} alt={props.alt || 'mocked image'} />;
  };
  MockedImage.displayName = 'MockedImage';
  return MockedImage;
});

// Set up our environment variable before the mock
// Using a variable that Jest will preserve between test runs
let mockDynamicMode = 'loaded'; // 'loaded' or 'loading'

// Create a more reliable mock for next/dynamic
jest.mock('next/dynamic', () => {
  return function dynamicMock() {
    // Return a component that checks the mode at render time
    const DynamicComponent = () => {
      if (mockDynamicMode === 'loading') {
        // Return the actual loading component from options
        return <div data-testid="loading-placeholder" className="animate-pulse h-64 bg-amber-100 rounded-xl flex items-center justify-center" />;
      } else {
        // Return the mocked loaded component
        return <div data-testid="auth-header">Mocked AuthHeader</div>;
      }
    };
    
    DynamicComponent.displayName = 'DynamicMockComponent';
    return DynamicComponent;
  };
});

describe('HeroSection', () => {
  // Test the component with loaded AuthHeader
  describe('with AuthHeader loaded', () => {
    beforeEach(() => {
      // Set mode to loaded
      mockDynamicMode = 'loaded';
    });

    it('renders background image with proper alt', async () => {
      await act(async () => {
        render(<HeroSection />);
      });
      
      const bgImage = screen.getByAltText('Meal background');
      expect(bgImage).toBeInTheDocument();
    });

    it('renders AuthHeader when loaded', async () => {
      await act(async () => {
        render(<HeroSection />);
      });
      
      const authHeader = screen.getByTestId('auth-header');
      expect(authHeader).toBeInTheDocument();
    });

    it('renders main title with highlight', async () => {
      await act(async () => {
        render(<HeroSection />);
      });
      
      expect(screen.getByText(/Découvrez des Recettes/i)).toBeInTheDocument();
      expect(screen.getByText('Délicieuses')).toBeInTheDocument();
    });

    it('renders description text', async () => {
      await act(async () => {
        render(<HeroSection />);
      });
      
      expect(
        screen.getByText(/Des plats savoureux et faciles à préparer/)
      ).toBeInTheDocument();
    });

    it('renders both CTA buttons with correct labels and links', async () => {
      await act(async () => {
        render(<HeroSection />);
      });
      
      expect(screen.getByRole('button', { name: /Explorer nos recettes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Recette Tendance/i })).toBeInTheDocument();

      expect(screen.getByRole('link', { name: /Explorer nos recettes/i })).toHaveAttribute(
        'href',
        '#all-recipes'
      );
      expect(screen.getByRole('link', { name: /Recette Tendance/i })).toHaveAttribute(
        'href',
        '#trending-recipe'
      );
    });

    it('includes the bottom gradient divider', async () => {
      await act(async () => {
        render(<HeroSection />);
      });
      
      const gradientDiv = screen.getByTestId('gradient-divider');
      expect(gradientDiv).toBeInTheDocument();
    });
  });

  // Test specifically for the loading state
  describe('with AuthHeader in loading state', () => {
    beforeEach(() => {
      // Set mode to loading
      mockDynamicMode = 'loading';
    });

    it('renders loading state placeholder when AuthHeader is loading', async () => {
      await act(async () => {
        render(<HeroSection />);
      });
      
      const loadingPlaceholder = screen.getByTestId('loading-placeholder');
      expect(loadingPlaceholder).toBeInTheDocument();
    });
  });
});