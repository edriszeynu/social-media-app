// components/navbar/SearchBar.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div
      className={`hidden md:flex items-center transition-all duration-300 ease-in-out ${
        searchFocused ? "flex-1 max-w-md" : "flex-1 max-w-xs"
      }`}
    >
      <div className="relative w-full">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
            searchFocused ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <Input
          placeholder="Search users, posts, or hashtags..."
          className="pl-9 pr-4 py-2 bg-muted/50 border-0 rounded-full focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:bg-background transition-all duration-200 text-sm"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchFocused && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
              ⌘K
            </kbd>
          </div>
        )}
      </div>
    </div>
  );
}