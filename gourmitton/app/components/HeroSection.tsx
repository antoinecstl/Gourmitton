import Image from "next/image";
import dynamic from "next/dynamic";

const AuthHeader = dynamic(() => import('@/app/components/AuthHeader'), {
    loading: () => <div className="animate-pulse h-64 bg-amber-100 rounded-xl flex items-center justify-center"></div>,
  });

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-amber-600 to-amber-800">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/cuisine_squared.webp"
          alt="Meal background"
          className="absolute inset-0 h-screen object-cover opacity-50 scale-105 animate-slow-zoom"
          priority
          width={1920}
          height={1080}
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
  );
}