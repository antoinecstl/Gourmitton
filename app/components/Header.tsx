"use client";
import { usePathname } from "next/navigation";
import AuthHeader from "./AuthHeader";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div className="bg-gray-900 w-full h-19 p-2 md:p-5 flex justify-between items-center">
      <AuthHeader />
    </div>
  );
};