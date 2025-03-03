'use client';

import { useEffect, useState } from 'react';
import { Recipe, getRecipes, getFavorites } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../contexts/AuthContext';
import Image from "next/image";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  const fetchFavorites = async () => {
    if (!user?.token) return;
    
    try {
      const favorites = await getFavorites(user.token);
      setFavorites(favorites.map(recipe => recipe.id));
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const refreshData = () => {
    setLoading(true);
    Promise.all([fetchRecipes(), user && fetchFavorites()].filter(Boolean))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  if (loading) {
    return <div className="text-center">Chargement des recettes...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Découvrez nos recettes</h1>
      
      {recipes.length === 0 ? (
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
