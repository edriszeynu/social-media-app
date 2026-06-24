// components/navbar/NavActions.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Bell, MessageCircle } from "lucide-react";

interface NavActionsProps {
  messageCount?: number;
  notificationCount?: number;
}

export function NavActions({ messageCount = 5, notificationCount = 3 }: NavActionsProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link href="/feed">
        <Button
          variant={isActive("/feed") ? "default" : "ghost"}
          size="icon"
          className={`rounded-full transition-all duration-200 ${
            isActive("/feed")
              ? "bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30"
              : "hover:bg-muted/50"
          }`}
        >
          <Home className="h-5 w-5" />
        </Button>
      </Link>

      <Link href="/messages">
        <Button
          variant="ghost"
          size="icon"
          className={`relative rounded-full transition-all duration-200 ${
            isActive("/messages") ? "bg-muted/50 text-primary" : "hover:bg-muted/50"
          }`}
        >
          <MessageCircle className="h-5 w-5" />
          {messageCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-background animate-pulse">
              {messageCount}
            </span>
          )}
        </Button>
      </Link>

      <Link href="/notifications">
        <Button
          variant="ghost"
          size="icon"
          className={`relative rounded-full transition-all duration-200 ${
            isActive("/notifications") ? "bg-muted/50 text-primary" : "hover:bg-muted/50"
          }`}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-background">
              {notificationCount}
            </span>
          )}
        </Button>
      </Link>
    </div>
  );
}