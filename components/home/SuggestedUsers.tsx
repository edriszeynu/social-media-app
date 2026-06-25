// components/home/SuggestedUsers.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { User } from "@/lib/types";
import { toggleFollow } from "@/app/actions/social";

interface SuggestedUsersProps {
  users: User[];
  maxDisplay?: number;
}

export function SuggestedUsers({ users, maxDisplay = 3 }: SuggestedUsersProps) {
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleFollow = (userId: string) => {
    setPendingId(userId);
    startTransition(async () => {
      await toggleFollow(userId);
      setFollowing((prev) => {
        const next = new Set(prev);
        next.has(userId) ? next.delete(userId) : next.add(userId);
        return next;
      });
      setPendingId(null);
    });
  };

  const displayUsers = users.slice(0, maxDisplay);

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          Who to Follow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayUsers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">No suggestions</p>
        )}
        {displayUsers.map((user) => {
          const isFollowing = following.has(user.id);
          const loading = pendingId === user.id;
          return (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors duration-200"
            >
              <Link href={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={user.avatar ?? undefined} alt={user.username} />
                  <AvatarFallback className="text-xs">
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none">{user.username}</p>
                  {user.bio && (
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user.bio}</p>
                  )}
                </div>
              </Link>
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                className="h-7 text-xs shrink-0"
                disabled={loading}
                onClick={() => handleFollow(user.id)}
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          );
        })}
        {users.length > maxDisplay && (
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View all suggestions →
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
