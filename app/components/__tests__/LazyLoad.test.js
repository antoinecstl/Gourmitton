import React from 'react';
import { render } from '@testing-library/react';
import { LazyLoadedSection } from '../LazyLoad';

// Mock framer-motion's useInView hook
jest.mock('framer-motion', () => ({
  useInView: jest.fn()
}));

import { useInView } from 'framer-motion';

describe('LazyLoadedSection', () => {
  const mockUseInView = useInView;
  
  beforeEach(() => {
    mockUseInView.mockReset();
  });
  
  it('renders a placeholder when not in view', () => {
    // Mock useInView to return false (not in view)
    mockUseInView.mockReturnValue(false);
    
    const { container } = render(
      <LazyLoadedSection>
        <div data-testid="actual-content">Content</div>
      </LazyLoadedSection>
    );
    
    // Check that the placeholder is rendered
    const placeholder = container.querySelector('.h-64.bg-amber-100\\/30.rounded-xl');
    expect(placeholder).toBeInTheDocument();
    
    // Check that the children are not rendered
    const content = container.querySelector('[data-testid="actual-content"]');
    expect(content).not.toBeInTheDocument();
  });
  
  it('renders children when in view', () => {
    // Mock useInView to return true (in view)
    mockUseInView.mockReturnValue(true);
    
    const { container, getByTestId } = render(
      <LazyLoadedSection>
        <div data-testid="actual-content">Content</div>
      </LazyLoadedSection>
    );
    
    // Check that children are rendered
    const content = getByTestId('actual-content');
    expect(content).toBeInTheDocument();
    
    // Check that the placeholder is not rendered
    const placeholder = container.querySelector('.h-64.bg-amber-100\\/30.rounded-xl');
    expect(placeholder).not.toBeInTheDocument();
  });
  
  it('sets up the ref and useInView correctly', () => {
    // Mock useInView implementation
    mockUseInView.mockImplementation((ref, options) => {
      // Verify that options are correctly passed
      expect(options).toEqual({ once: true, amount: 0.1 });
      // Verify ref is passed (will be a ref object)
      expect(ref).toBeDefined();
      return true;
    });
    
    render(
      <LazyLoadedSection>
        <div>Content</div>
      </LazyLoadedSection>
    );
    
    // Check that useInView was called
    expect(mockUseInView).toHaveBeenCalled();
  });
});