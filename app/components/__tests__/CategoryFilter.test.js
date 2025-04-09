import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter Component', () => {
  const mockCategories = ['Entrées', 'Plats', 'Desserts', 'Boissons'];
  const mockOnCategoryChange = jest.fn();

  beforeEach(() => {
    // Réinitialiser le mock entre les tests
    mockOnCategoryChange.mockClear();
  });

  it('renders all category buttons', () => {
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={null} 
        onCategoryChange={mockOnCategoryChange} 
      />
    );

    // Vérifier le titre
    expect(screen.getByText('Filtrer par:')).toBeInTheDocument();
    
    // Vérifier le bouton "Tous"
    expect(screen.getByText('Tous')).toBeInTheDocument();
    
    // Vérifier que tous les boutons de catégorie sont présents
    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('applies correct styling to selected category', () => {
    const selectedCategory = 'Plats';
    
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={selectedCategory} 
        onCategoryChange={mockOnCategoryChange} 
      />
    );

    // Vérifier que le bouton de la catégorie sélectionnée a la classe de fond appropriée
    const selectedButton = screen.getByText(selectedCategory);
    expect(selectedButton).toHaveClass('bg-amber-600');
    expect(selectedButton).toHaveClass('text-white');
    
    // Vérifier que les autres boutons n'ont pas la classe de fond sélectionnée
    const nonSelectedButton = screen.getByText('Entrées');
    expect(nonSelectedButton).toHaveClass('bg-amber-100');
    expect(nonSelectedButton).not.toHaveClass('bg-amber-600');
  });

  it('applies correct styling to "Tous" button when no category is selected', () => {
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={null} 
        onCategoryChange={mockOnCategoryChange} 
      />
    );

    // Vérifier que le bouton "Tous" a la classe de fond appropriée quand selectedCategory est null
    const tousButton = screen.getByText('Tous');
    expect(tousButton).toHaveClass('bg-amber-600');
    expect(tousButton).toHaveClass('text-white');
  });

  it('calls onCategoryChange with null when "Tous" button is clicked', () => {
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory='Plats' 
        onCategoryChange={mockOnCategoryChange} 
      />
    );

    // Cliquer sur le bouton "Tous"
    fireEvent.click(screen.getByText('Tous'));
    
    // Vérifier que onCategoryChange est appelé avec null
    expect(mockOnCategoryChange).toHaveBeenCalledWith(null);
  });

  it('calls onCategoryChange with category name when category button is clicked', () => {
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={null} 
        onCategoryChange={mockOnCategoryChange} 
      />
    );

    // Cliquer sur un bouton de catégorie
    fireEvent.click(screen.getByText('Desserts'));
    
    // Vérifier que onCategoryChange est appelé avec le nom de la catégorie
    expect(mockOnCategoryChange).toHaveBeenCalledWith('Desserts');
  });

  it('calls onCategoryChange with null when already selected category is clicked again', () => {
    const selectedCategory = 'Boissons';
    
    render(
      <CategoryFilter 
        categories={mockCategories} 
        selectedCategory={selectedCategory} 
        onCategoryChange={mockOnCategoryChange} 
      />
    );

    // Cliquer sur la catégorie déjà sélectionnée
    fireEvent.click(screen.getByText(selectedCategory));
    
    // Vérifier que onCategoryChange est appelé avec null (désélection)
    expect(mockOnCategoryChange).toHaveBeenCalledWith(null);
  });

  it('works with empty categories array', () => {
    render(
      <CategoryFilter 
        categories={[]} 
        selectedCategory={null} 
        onCategoryChange={mockOnCategoryChange} 
      />
    );
    
    // Vérifier que le composant se rend sans erreur
    expect(screen.getByText('Filtrer par:')).toBeInTheDocument();
    expect(screen.getByText('Tous')).toBeInTheDocument();
    
    // Vérifier qu'aucun autre bouton n'est rendu
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});