'use client';

import { useEffect, useState, useCallback } from 'react';
import { Recipe, getRecipes, getFavorites } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      setError("Impossible de récupérer les recettes. Veuillez réessayer plus tard.");
    }
  };

  const fetchFavorites = async () => {
    if (!user?.token) return;
    
    try {
      const favorites = await getFavorites(user.token);
      setFavorites(favorites.map(recipe => recipe.id));
      setError(null);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setError("Impossible de récupérer vos favoris. Veuillez réessayer plus tard.");
    }
  };

  const refreshData = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchRecipes(), 
      user ? fetchFavorites() : Promise.resolve()
    ])
    .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Découvrez nos recettes</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
          <p className="ml-2">Chargement des recettes...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
          <button 
            onClick={refreshData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <p>Aucune recette disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              isFavorite={favorites.includes(recipe.id)}
              onFavoriteToggle={refreshData}
            />
          ))}
        </div>
      )}
    </div>
  );
}
