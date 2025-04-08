'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AuthHeader() {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('jwt_token')) {
            setIsLogged(true);
        }
        setLoading(false);

        async function fetchUserData() {

            // Check if we're in a browser environment and if the token exists
            if (localStorage.getItem('jwt_token')) {
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
                        localStorage.setItem('username', userData.username);
                        setIsLogged(true);
                    }
                    else {
                        localStorage.removeItem('jwt_token');
                        setIsLogged(false);
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
        localStorage.removeItem('username');
        setUsername(null);
        window.location.reload();
    }

    return (
        <div className="absolute top-0 left-0 w-full pt-4 p-6 flex justify-between items-center z-20">
            <Link href="/">
                <h1 className="text-3xl font-bold text-amber-200 drop-shadow-lg cursor-pointer">Gourmitton</h1>
            </Link>
            { !loading ? (
                <>
                {isLogged ? (
                    <div className="flex items-center space-x-4">
                        <Link href="/favorites" className="bg-white/10 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20 transition-all">
                            {username}
                        </Link>
                        <button
                            onClick={logout}
                            className="bg-white/10 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20 transition-all flex direction-row"
                        >
                            <svg className="mr-2" width="25px" height="25px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            Déconnexion
                        </button>
                    </div>
                ) : (
                    <Link href="/login">
                        <button className="bg-white/10 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20 transition-all flex direction-row">
                            <svg className="mr-1.5" width="25px" height="25px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.00098 11.999L16.001 11.999M16.001 11.999L12.501 8.99902M16.001 11.999L12.501 14.999" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
                            Connexion
                        </button>
                    </Link>
                )}
                </>
            ) : (
                <div className="flex items-center space-x-4">
                    <div className="animate-pulse bg-white/10 text-white px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20 w-20"></div>
                    <div className="animate-pulse bg-white/10 text-white px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20 w-20"></div>
                </div>
            )}
        </div>
    );
}