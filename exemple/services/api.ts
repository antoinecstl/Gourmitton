const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  ingredients: string[];
  steps: string[];
  // Add other fields as needed
}

export interface User {
  id: string;
  username: string;
  token?: string;
}

// Get all recipes
export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'GET',
    headers: {
      'Accept': `application/json`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

// Get a single recipe
export async function getRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch recipe with id ${id}`);
  }
  return response.json();
}

// Login
export async function login(username: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  
  return response.json();
}

// Get favorites
export async function getFavorites(token: string): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  
  return response.json();
}

// Add to favorites
export async function addToFavorites(recipeId: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/favorites/${recipeId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to add to favorites');
  }
}

// Remove from favorites
export async function removeFromFavorites(recipeId: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/favorites/${recipeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove from favorites');
  }
}
