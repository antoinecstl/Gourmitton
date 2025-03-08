'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AuthHeader() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserData() {

            // Check if we're in a browser environment and if the token exists
            if (localStorage.getItem('jwt_token')){
                try {
                    const res = await fetch('https://gourmet.cours.quimerch.com/me', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
                        },
                        credentials: 'include' as RequestCredentials,
                        cache: 'no-store'
                    });

                    if (res.ok) {
                        const userData = await res.json();
                        setUsername(userData.username);
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err);
                }
            }
        }
        fetchUserData();
    }, [username]);

    function logout() {
        localStorage.removeItem('jwt_token');
        setUsername(null);
    }

    return (
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
            <Link href="/">
                <h1 className="text-3xl font-bold text-amber-200 drop-shadow-lg cursor-pointer">Gourmitton</h1>
            </Link>
            {username ? (
                <div className="flex items-center space-x-4">
                    <Link href="/profile">
                        {username}
                    </Link>
                    <button
                        onClick={logout}
                        className="bg-white/10 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20 transition-all"
                    >
                        Déconnexion
                    </button>
                </div>
            ) : (
                <Link href="/login">
                    <button className="bg-white/10 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20 transition-all">
                        Connexion
                    </button>
                </Link>
            )}
        </div>
    );
}