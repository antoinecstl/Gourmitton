"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LazyLoadedSection } from '../components/LazyLoad';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const url = "https://gourmet.cours.quimerch.com/login";
        const data = { username, password };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' as RequestCredentials,
            body: JSON.stringify(data)
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    // Save cookies received from the server
                    localStorage.setItem('jwt_token', data.token);
                    // Redirect to the home page
                    router.push('/');
                }
                else {
                    alert('Invalid credentials');
                }
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-amber-50">
            <div className="relative px-8 py-10 text-left bg-white shadow-xl rounded-lg w-[450px] border-t-4 border-amber-500">
                {/* Decorative elements */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <Image src="/user.svg" alt="Gourmitton logo" width={40} height={40} />
                    </div>
                </div>
                <LazyLoadedSection>
                    <div className="mt-6">
                        <h3 className="text-3xl font-bold text-center text-amber-800 mb-1">Bienvenue</h3>
                        <p className="text-center text-gray-500 mb-6">Connectez-vous à votre compte gourmand</p>

                        <form className="mt-8" onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label className="block text-amber-700 text-sm font-medium mb-2" htmlFor="username">
                                    Nom d&apos;utilisateur
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        className={`w-full pl-10 px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-300 transition duration-200 bg-amber-50/50 text-gray-800`}
                                        type="text"
                                        id="username"
                                        placeholder="Entrez votre nom d'utilisateur"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-amber-700 text-sm font-medium mb-2" htmlFor="password">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        className="w-full pl-10 px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-300 transition duration-200 bg-amber-50/50 text-gray-800"
                                        type="password"
                                        id="password"
                                        placeholder="Entrez votre mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center mt-8">
                                <button
                                    className="px-6 py-3 rounded-lg bg-amber-500 text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 font-medium transform transition duration-200 hover:scale-105 shadow-md w-full"
                                    type="submit"
                                >
                                    Se connecter
                                </button>
                            </div>
                        </form>

                        {/* Small decorative food icons at bottom */}
                        <div className="flex justify-center mt-6 space-x-3 opacity-50">
                            <span className="text-xl">🍕</span>
                            <span className="text-xl">🍝</span>
                            <span className="text-xl">🥗</span>
                            <span className="text-xl">🍰</span>
                        </div>
                    </div>
                </LazyLoadedSection>
            </div>
        </div>
    );
}