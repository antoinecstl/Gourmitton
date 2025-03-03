'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Gourmitton
        </Link>
        <nav className="flex gap-4">
          <Link href="/" className="hover:text-gray-300">
            Accueil
          </Link>
          {user ? (
            <>
              <Link href="/favorites" className="hover:text-gray-300">
                Mes Favoris
              </Link>
              <button onClick={logout} className="hover:text-gray-300">
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-gray-300">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
