"use client";
import { useState, useEffect } from "react";
import { Recipe, RecipeCardProps } from "@/app/types/Recipe";
import Link from "next/link";
import { LazyLoadedSection } from "../components/LazyLoad";
import dynamic from "next/dynamic";

const RecipeCard = dynamic(() => import('@/app/components/RecipeCard'), {
    loading: () => <div className="animate-pulse h-64 bg-amber-100 rounded-xl flex items-center justify-center"></div>,
    });

export default function FavoritesPage() {
    const [loading, setLoading] = useState(true);
    const [favoritesCardProps, setFavoritesCardProps] = useState<RecipeCardProps[]>([]);
    const [favorites, setFavorites] = useState<Recipe[]>([]);

    useEffect(() => {
        async function fetchFavorites() {
            try {
                const res = await fetch('https://gourmet.cours.quimerch.com/favorites', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
                    },
                    credentials: 'include' as RequestCredentials
                });

                if (res.ok) {
                    const data = await res.json();
                    setFavoritesCardProps(data);
                    const recipeData = data.map((favoriteCardProp: RecipeCardProps) => favoriteCardProp.recipe);
                    setFavorites(recipeData);
                }
            } catch (err) {
                console.error('Error fetching favorites:', err);
            }
            setLoading(false);
        }
        fetchFavorites();
    }, []);

    return (
        <div className="min-h-screen bg-amber-50 py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-amber-800 mb-8 text-center">Mes Recettes Favorites</h1>
                <LazyLoadedSection>
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[40vh]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                        </div>
                    ) : !localStorage.getItem('jwt_token') ? (
                        <div className="text-center py-10 max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
                            <p className="text-gray-600 mb-6">Vous devez être connecté pour voir vos favoris.</p>
                            <Link href="/login" prefetch={false} className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all">
                                Se connecter
                            </Link>
                        </div>
                    ) : favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoritesCardProps.map((favoriteCardProp) => (
                                <div key={favoriteCardProp.recipe.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                                    <RecipeCard recipe={favoriteCardProp.recipe} deleteButton={true} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
                            <p className="text-gray-600 mb-6">Vous n&apos;avez pas encore de recettes favorites.</p>
                            <Link href="/#all-recipes" prefetch={false} className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all">
                                Découvrir des recettes
                            </Link>
                        </div>
                    )}
                </LazyLoadedSection>
            </div>
        </div>
    );
}