'use client';

import { useEffect, useState } from 'react';
import { getRecipe, Recipe, getFavorites, addToFavorites, removeFromFavorites } from '../../../services/api';
import Image from 'next/image';
import { useAuth } from '../../../contexts/AuthContext';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecipeAndFavoriteStatus = async () => {
    setLoading(true);
    
    try {
      const recipeData = await getRecipe(params.id);
      setRecipe(recipeData);
      
      if (user?.token) {
        const favorites = await getFavorites(user.token);
        setIsFavorite(favorites.some(fav => fav.id === params.id));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeAndFavoriteStatus();
  }, [params.id, user]);

  const handleFavoriteToggle = async () => {
    if (!user?.token || !recipe) return;

    try {
      if (isFavorite) {
        await removeFromFavorites(recipe.id, user.token);
      } else {
        await addToFavorites(recipe.id, user.token);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement de la recette...</div>;
  }

  if (!recipe) {
    return <div className="text-center py-8">Recette non trouvée</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        {user && (
          <button
            onClick={handleFavoriteToggle}
            className={`text-2xl ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
          >
            ♥
          </button>
        )}
      </div>

      {recipe.imageUrl && (
        <div className="relative h-96 w-full mb-6">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{recipe.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Ingrédients</h2>
        <ul className="list-disc pl-5">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="mb-1">{ingredient}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal pl-5">
          {recipe.steps.map((step, index) => (
            <li key={index} className="mb-2">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
