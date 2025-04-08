'use client';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category === selectedCategory ? null : category);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="font-medium text-amber-800 mr-2">Filtrer par:</span>
      <button 
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === null 
            ? 'bg-amber-600 text-white shadow-md' 
            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
        }`}
      >
        Tous
      </button>
      
      {categories.map((category) => (
        <button 
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category 
              ? 'bg-amber-600 text-white shadow-md' 
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
