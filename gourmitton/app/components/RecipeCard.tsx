import Link from "next/link";

interface Recipe {
  id: number;
  image_url?: string;
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  when_to_eat: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100 group">
      <div className="relative h-56 overflow-hidden">
        {recipe.image_url ? (
          <img 
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
              {recipe.total_time} min
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
        
        <Link 
          href={`/recipe/${recipe.id}`}
          className="w-full text-center py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
        >
          <span>Voir la recette</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 transition-transform transform group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
