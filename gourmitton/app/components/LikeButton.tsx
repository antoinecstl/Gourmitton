"use client"

import { useState } from "react";

export default function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <button 
      onClick={() => setIsLiked(!isLiked)}
      className="transition-transform duration-200 transform hover:scale-110 active:scale-95 focus:outline-none"
      aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isLiked ? (
        // Coeur rempli (état aimé)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-7 h-7"
        >
          <path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            fill="#FF3B30"
            stroke="#FF3B30"
            strokeWidth="1"
          />
        </svg>
      ) : (
        // Coeur vide (état non aimé)
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-7 h-7"
        >
          <path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </button>
  );
}
