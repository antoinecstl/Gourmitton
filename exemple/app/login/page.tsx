'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect if already logged in
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="text-center">Chargement...</div>;
  }

  // Only show login form if not logged in
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>
      <LoginForm />
    </div>
  );
}
