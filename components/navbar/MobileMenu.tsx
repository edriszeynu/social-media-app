// components/navbar/MobileMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Bell, MessageCircle, User, Settings, Heart, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logoutUser } from "@/app/actions/auth";
import type { SessionPayload } from "@/lib/session";

interface MobileMenuProps {
  session: SessionPayload | null;
}

export function MobileMenu({ session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="md:hidden rounded-full hover:bg-muted/50 transition-all duration-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-3/4 max-w-sm bg-background/95 backdrop-blur-xl border-l border-border/40 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 mobile-menu-scroll overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              SocialApp
            </span>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {session && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-primary-foreground font-bold">
                {session.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{session.username}</p>
                <p className="text-xs text-muted-foreground">{session.email}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1">
            {[
              { href: "/feed", icon: Home, label: "Home" },
              { href: "/messages", icon: MessageCircle, label: "Messages" },
              { href: "/notifications", icon: Bell, label: "Notifications" },
              ...(session ? [{ href: `/profile/${session.username}`, icon: User, label: "Profile" }] : []),
              { href: "/saved", icon: Heart, label: "Saved Posts" },
              { href: "/settings", icon: Settings, label: "Settings" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={toggleMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  pathname === href
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-border/40 pt-4 mt-4 flex items-center justify-between">
            <ThemeToggle />
            {session ? (
              <form action={logoutUser}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            ) : (
              <Link href="/login" onClick={toggleMenu}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
