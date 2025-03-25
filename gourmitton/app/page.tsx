import Image from "next/image";
import dynamic from "next/dynamic";
import { Recipe } from "@/app/types/Recipe";
import { LazyLoadedSection } from "./components/LazyLoad";

const MostLikedRecipe = dynamic(() => import('@/app/components/MostLikedRecipe'), {
  loading: () => <div className="animate-pulse h-64 bg-amber-100 rounded-xl flex items-center justify-center"></div>,
});

const RecipeSection = dynamic(() => import('@/app/components/RecipeSection'), {
  loading: () => <div className="animate-pulse h-64 bg-amber-100 rounded-xl flex items-center justify-center"></div>,
});

const AuthHeader = dynamic(() => import('@/app/components/AuthHeader'), {
  loading: () => <div className="animate-pulse h-64 bg-amber-100 rounded-xl flex items-center justify-center"></div>,
});

export default async function Home() {

  const res = await fetch('https://gourmet.cours.quimerch.com/recipes', {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store'
  });
  const recipes: Recipe[] = await res.json();

  // Most liked Recipe (TODO)
  const TendanceRecipe = recipes.map((r: Recipe) => ({
    id: r.id,
    image_url: r.image_url,
    name: r.name,
    description: r.description,
    prep_time: r.prep_time,
    cook_time: r.cook_time,
    total_time: r.prep_time + r.cook_time,
    when_to_eat: r.when_to_eat,
    calories: r.calories,
    servings: r.servings,
    created_at: r.created_at,
    ingredients: r.ingredients,
    instructions: r.instructions,
    category: r.category,
    cost: r.cost,
    created_by: r.created_by,
    disclaimer: r.disclaimer,
    published: r.published,
  }))[Math.floor(Math.random() * recipes.length)];
  
  // Obtenir toutes les catégories uniques
  const categories: string[] = [...new Set(recipes.map((r: Recipe) => r.when_to_eat as string))];

  return (
    <div className="min-h-screen min-w-fit flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-amber-600 to-amber-800">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="/cuisine_squared_cropped.webp" 
            alt="Meal background"
            className="absolute inset-0 h-screen object-cover opacity-50 scale-105 animate-slow-zoom" 
            priority
            width={1760}
            height={894}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-amber-800/70"></div>
        </div>
        
        {/*  header with title and login button */}
        <AuthHeader />
        
        <div className="z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-md animate-fade-in">
            Découvrez des Recettes <span className="text-amber-200">Délicieuses</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 mx-auto">
            Des plats savoureux et faciles à préparer pour toutes les occasions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#all-recipes">
              <button className="bg-white text-amber-800 hover:bg-amber-100 font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg">
                Explorer nos recettes
              </button>
            </a>
            <a href="#trending-recipe">
              <button className="border-2 border-white text-white hover:bg-white/20 font-bold py-4 px-8 rounded-full transition-all">
                Recette Tendance
              </button>
            </a>
          </div>
        </div>
        
        {/* Gradient divider */}
        <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </section>
      
      {/* Recipe of the Day */}
      <LazyLoadedSection>
        <section id="trending-recipe" className="bg-amber-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-800 mb-8 text-center flex items-center justify-center gap-2">
              <span className="text-amber-600">✨</span> La Recette Tendance <span className="text-amber-600">✨</span>
            </h2>
            <MostLikedRecipe recipe={TendanceRecipe} />
          </div>
        </section>
      </LazyLoadedSection>
      
      {/* Main Recipes Section with Filters - Now using the RecipeSection component */}
      <LazyLoadedSection>
        <section id="all-recipes">
          <RecipeSection recipes={recipes.map((r: Recipe) => ({
            ...r
          }))} categories={categories} />
        </section>
      </LazyLoadedSection>
        
      {/* Newsletter Section with improved visuals */}
      <section className="bg-amber-600 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <span className="inline-block text-3xl mb-4">🍳</span>
          <h2 className="text-3xl font-bold text-white mb-6">Restez inspiré(e)</h2>
          <p className="text-lg text-amber-100 mb-8">Inscrivez-vous à notre newsletter pour recevoir de nouvelles recettes chaque semaine</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="px-6 py-4 rounded-full text-black flex-grow max-w-md border-2 border-amber-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all"
            />
            <button className="bg-white text-amber-700 font-bold py-4 px-8 rounded-full hover:bg-amber-100 transition-colors shadow-lg">
              S&apos;inscrire
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
