// components/home/SuggestedUsers.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { User } from "@/lib/dummy-data";

interface SuggestedUsersProps {
  users: User[];
  maxDisplay?: number;
}

export function SuggestedUsers({ users, maxDisplay = 3 }: SuggestedUsersProps) {
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const handleFollow = (userId: string) => {
    setFollowing((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const displayUsers = users.slice(0, maxDisplay);
  const hasMore = users.length > maxDisplay;

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          Who to Follow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayUsers.map((user) => {
          const isFollowing = following.has(user.id);
          return (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors duration-200"
            >
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 flex-1"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="text-xs">
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {user.bio}
                  </p>
                </div>
              </Link>
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                className="h-7 text-xs"
                onClick={() => handleFollow(user.id)}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          );
        })}
        {hasMore && (
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