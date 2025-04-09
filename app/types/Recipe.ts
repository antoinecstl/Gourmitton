export interface Recipe {
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

export interface RecipePageProps {
    params: Promise<{
      id: string;
    }>;
}

export interface RecipeCardProps {
    recipe: Recipe;
    deleteButton: boolean;
    onDeleteSuccess?: (recipeId: string) => void;
}

export interface RecipeSectionProps {
  recipes: Recipe[];
  categories: string[];
}

export interface RecipeFormProps {
    recipe: Recipe;
}