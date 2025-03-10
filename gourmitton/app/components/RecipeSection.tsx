'use client';

import { useState } from 'react';
import RecipeCard from './RecipeCard';
import CategoryFilter from './CategoryFilter';
import { RecipeSectionProps } from '@/app/types/Recipe';

export default function RecipeSection({ recipes, categories }: RecipeSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter recipes based on the selected category
  const filteredRecipes = selectedCategory 
    ? recipes.filter(recipe => recipe.when_to_eat === selectedCategory) 
    : recipes;

  return (
    <section className="bg-amber-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-amber-800 mb-4 md:mb-0">Explorez nos recettes</h2>
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} deleteButton={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
