// components/navbar/Logo.tsx
"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <Link href="/feed" className="group flex items-center gap-2 shrink-0">
      <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-all duration-300">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 rounded-xl logo-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:block">
        SocialApp
      </span>
    </Link>
  );
}