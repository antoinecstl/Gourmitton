"use client";
import { usePathname } from "next/navigation";
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
        <div className="bg-gray-900 w-full p-2 md:p-5 flex justify-between items-center">
          <Link href={`/`}>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-amber-200 drop-shadow-lg cursor-pointer">Gourmitton</h1>
          </Link>
            <button className="text-sm md:text-md hover:text-amber-400 text-white drop-shadow-lg cursor-pointer transition-all">
            👤 Connexion
          </button>
        </div>
        
    );
};
