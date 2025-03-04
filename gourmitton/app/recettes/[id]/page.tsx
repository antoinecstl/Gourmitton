import Link from "next/link";
import Image from "next/image";

import RecipeCard from "@/app/components/RecipeCard";

// Définition du type de la recette
interface Recipe {
  id: string;
  name: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  when_to_eat: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  servings: number;
  created_at: string;
  total_time: number;
  category: string;
  cost: number;
  created_by: string;
  difficulty: string;
  is_featured: boolean;
  disclaimer: string;
  published: boolean;
}

// Spécifier les types des paramètres
interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  // Récupérer l'ID depuis les paramètres d'URL en utilisant await
  const { id } = await Promise.resolve(params);
  
  // Fetch de la recette spécifique avec l'ID
  const res = await fetch(`https://gourmet.cours.quimerch.com/recipes/${id}`, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store'
  });
  
  // Vérifier si la réponse est OK
  if (!res.ok) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Recette non trouvée</h1>
          <p className="text-gray-600 mb-6">
            Nous n&apos;avons pas pu trouver la recette que vous cherchez.
          </p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }
  
  // Récupérer les données de la recette
  const recipe: Recipe = await res.json();

  const relatedRecipes = await fetch(`https://gourmet.cours.quimerch.com/recipes?limit=3`, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store'
  }).then(res => res.json());

  return (
    <div className="min-h-screen bg-amber-50">
      {/* En-tête avec image de couverture */}
      <div className="relative h-[40vh] md:h-[50vh] bg-amber-800">
        {recipe.image_url ? (
          <Image 
            src={recipe.image_url} 
            alt={recipe.name} 
            fill
            unoptimized
            style={{ objectFit: 'cover' }}
            className="absolute inset-0 w-full h-full opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 w-full p-6 z-10">
          <Link 
            href="/"
            className="inline-flex items-center text-white hover:text-amber-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux recettes
          </Link>
        </div>
        
        {/* Informations de base sur la recette */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
          <div className="container mx-auto">
            {recipe.when_to_eat && (
              <span className="inline-block bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                {recipe.when_to_eat}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{recipe.name}</h1>
            <p className="text-lg text-amber-100 max-w-2xl mb-4">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm mt-6">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-amber-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Préparation: {recipe.prep_time} min</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-amber-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
                <span>Cuisson: {recipe.cook_time} min</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-amber-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Total: {recipe.prep_time + recipe.cook_time} min</span>
              </div>
              
              {recipe.servings != 0 && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-amber-300">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Pour {recipe.servings} personnes</span>
                </div>
              )}
              
              {recipe.calories != 0 && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-amber-300">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{recipe.calories} calories</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Ingrédients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 sticky top-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ingrédients
              </h2>
              
              <ul className="space-y-3">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
                
                {!recipe.ingredients?.length && (
                  <p className="text-gray-500 italic">Aucun ingrédient spécifié.</p>
                )}
              </ul>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-amber-800 mb-8 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2 text-amber-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Préparation
            </h2>
            
            <div className="space-y-8">
                {recipe.instructions && (
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-500">
                  {recipe.instructions.split('\n').map((instruction, index) => (
                    <p key={index} className="text-gray-700 mb-4">
                    {instruction}
                    </p>
                  ))}
                  </div>
                )}
              
              {!recipe.instructions && (
                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-500">
                  <p className="text-gray-500 italic">Aucune étape de préparation spécifiée.</p>
                </div>
              )}
            </div>
            
            {/* Date de création */}
            {recipe.created_at && (
              <div className="mt-12 text-sm text-gray-500">
                Recette ajoutée le {new Date(recipe.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}

            {/* Recettes similaires */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-amber-800 mb-8 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Recettes similaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedRecipes.slice(0, 3).map((recipe: Recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}