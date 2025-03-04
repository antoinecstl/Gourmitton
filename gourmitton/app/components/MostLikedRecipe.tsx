import Link from 'next/link';

interface RecipeProps {
  recipe: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    prep_time: number;
    cook_time: number;
    when_to_eat: string;
  };
}

export default function MostLikedRecipe({ recipe }: RecipeProps) {
  if (!recipe) return null;
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/2 h-80 md:h-98 relative">
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
      </div>
      <div className="p-8 md:w-1/2 flex flex-col justify-center">
        <div className="flex items-center mb-4">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            {recipe.when_to_eat}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-amber-500">⏱️</span>
            <span className="text-gray-600 text-sm">{recipe.prep_time + recipe.cook_time} min</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{recipe.name}</h3>
        <p className="text-gray-600 mb-6 line-clamp-3">{recipe.description}</p>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-1">
            <span className="text-amber-500">⏲️</span>
            <span className="text-sm text-gray-600">Préparation: {recipe.prep_time} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500">🍳</span>
            <span className="text-sm text-gray-600">Cuisson: {recipe.cook_time} min</span>
          </div>
        </div>
        <Link href={`/recettes/${recipe.id}`} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full mt-auto self-start transition-colors font-medium">
          Voir la recette
        </Link>
      </div>
    </div>
  );
}
