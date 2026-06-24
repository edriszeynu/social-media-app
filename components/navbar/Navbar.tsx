// components/navbar/Navbar.tsx
"use client";

import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { NavActions } from "./NavActions";
import { UserDropdown } from "./UserDropdown";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Logo />

        <div className="flex items-center flex-1 justify-end md:justify-center gap-2 md:gap-4">
          {/* Search – hidden on mobile, visible on md+ */}
          <SearchBar />

          {/* Actions – visible on md+, hidden on mobile (they go into mobile menu) */}
          <div className="hidden md:flex items-center gap-2">
            <NavActions messageCount={5} notificationCount={3} />
          </div>

          {/* Theme toggle – visible on md+ */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* User dropdown – visible on md+, hidden on mobile (in mobile menu) */}
          <div className="hidden md:block">
            <UserDropdown />
          </div>

          {/* Mobile hamburger – visible only on small screens */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}