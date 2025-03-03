'use client';

import { useEffect, useState } from 'react';
import { Recipe, getFavorites } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import RecipeCard from '../../components/RecipeCard';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchFavorites = async () => {
    if (!user?.token) return;
    
    setLoading(true);
    try {
      const data = await getFavorites(user.token);
      setFavorites(data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }
    
    fetchFavorites();
  }, [user, router]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return <div className="text-center">Chargement de vos favoris...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Vos recettes favorites</h1>
      
      {favorites.length === 0 ? (
        <p>Vous n'avez pas encore de recettes favorites.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              isFavorite={true}
              onFavoriteToggle={fetchFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}
