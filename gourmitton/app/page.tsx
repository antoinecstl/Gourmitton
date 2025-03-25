import dynamic from "next/dynamic";
import { Recipe } from "@/app/types/Recipe";
import { LazyLoadedSection } from "./components/LazyLoad";

const MostLikedRecipe = dynamic(() => import('@/app/components/MostLikedRecipe'), {
  loading: () => <div className="animate-pulse h-64 bg-amber-100 rounded-xl flex items-center justify-center"></div>,
});

const RecipeSection = dynamic(() => import('@/app/components/RecipeSection'), {
  loading: () => <div className="animate-pulse h-64 bg-amber-100 rounded-xl flex items-center justify-center"></div>,
});

const HeroSection = dynamic(() => import('@/app/components/HeroSection'), {
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

  // Most liked Recipe
  const randomIndex = Math.floor(Math.random() * recipes.length);
  const TendanceRecipe = recipes[randomIndex];

  // Obtenir toutes les catégories uniques
  const categories: string[] = [...new Set(recipes.map((r: Recipe) => r.when_to_eat as string))];

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <HeroSection/>

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
          <RecipeSection recipes={recipes} categories={categories} />
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
