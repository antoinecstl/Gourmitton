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
      <HeroSection />

      {/* Recipe of the Day */}
      <section id="trending-recipe" className="bg-amber-50 py-12">
        <LazyLoadedSection>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-800 mb-8 text-center flex items-center justify-center gap-2">
              <span className="text-amber-600">✨</span> La Recette Tendance <span className="text-amber-600">✨</span>
            </h2>
            <MostLikedRecipe recipe={TendanceRecipe} />
          </div>
        </LazyLoadedSection>
      </section>

      {/* Main Recipes Section with Filters - Now using the RecipeSection component */}

      <section id="all-recipes">
        <LazyLoadedSection>
          <RecipeSection recipes={recipes} categories={categories} />
        </LazyLoadedSection>
      </section>
    </div>
  );
}
