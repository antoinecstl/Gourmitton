'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { addToFavorites, removeFromFavorites } from '../services/api';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export default function RecipeCard({ recipe, isFavorite = false, onFavoriteToggle }: RecipeCardProps) {
  const { user } = useAuth();

  const handleFavoriteToggle = async () => {
    if (!user?.token) return;
    
    try {
      if (isFavorite) {
        await removeFromFavorites(recipe.id, user.token);
      } else {
        await addToFavorites(recipe.id, user.token);
      }
      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      {recipe.imageUrl && (
        <div className="relative h-48 w-full">
          <Image 
            src={recipe.imageUrl} 
            alt={recipe.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-2">{recipe.title}</h2>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        <div className="flex justify-between items-center">
          <Link 
            href={`/recettes/${recipe.id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            Voir la recette
          </Link>
          {user && (
            <button 
              onClick={handleFavoriteToggle}
              className={`${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            >
              ♥
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
