
import Link from "next/link";
import Image from "next/image";
import { RecipeCardProps } from "@/app/types/Recipe";

export default function RecipeCard({ recipe, deleteButton }: RecipeCardProps) {

  async function handleRemoveFavorite(recipeID: string) {
    const username = localStorage.getItem('username');

    const url = `https://gourmet.cours.quimerch.com/users/${username}/favorites?recipeID=${recipeID}`;
    const options = {method: 'DELETE', headers: { ContentType: 'application/x-www-form-urlencoded', Accept: '*/*', Authorization: 'Bearer ' + localStorage.getItem('jwt_token')}};

    try {
      const response = await fetch(url, options);
      if (response.ok) {
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100 group">
      <div className="relative h-56 overflow-hidden">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        {recipe.when_to_eat && (
          <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {recipe.when_to_eat}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-amber-800 group-hover:text-amber-600 transition-colors">{recipe.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{recipe.description}</p>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-amber-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span title="Temps total">
              {recipe.cook_time + recipe.prep_time} min
            </span>
          </div>

          {recipe.prep_time && (
            <div title="Temps de préparation" className="flex items-center gap-1">
              <span className="text-xs">Prép:</span> {recipe.prep_time} min
            </div>
          )}

          {recipe.cook_time && (
            <div title="Temps de cuisson" className="flex items-center gap-1">
              <span className="text-xs">Cuisson:</span> {recipe.cook_time} min
            </div>
          )}
        </div>
        <Link href={`/recettes/${recipe.id}`} prefetch={false}>
          <div className="w-full text-center py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all flex direction-column items-center justify-center gap-2 group-hover:shadow-md">
            <span>Voir la recette</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 transition-transform transform group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        {deleteButton && (
          <button
            onClick={() => handleRemoveFavorite(recipe.id)}
            className="mt-2.5 w-full text-center py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all flex direction-column items-center justify-center gap-2 group-hover:shadow-md"
          >
            Retirer des favoris
            <svg viewBox="0 0 24.00 24.00" aria-labelledby="binIconTitle" stroke="#ffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" color="#ffff" className="w-4 h-4 transition-transform transform group-hover:translate-x-1"><g id="SVGRepo_bgCarrier" strokeWidth="2"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title id="binIconTitle">Bin</title> <path d="M19 6L5 6M14 5L10 5M6 10L6 20C6 20.6666667 6.33333333 21 7 21 7.66666667 21 11 21 17 21 17.6666667 21 18 20.6666667 18 20 18 19.3333333 18 16 18 10"></path> </g></svg>
          </button>
        )}
      </div>
    </div>
  );
}
