// components/home/Hero.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Clock, TrendingUp } from "lucide-react";
import { User } from "@/lib/types";

interface HeroProps {
  user: User;
  postCount: number;
  likeCount: number;
  commentCount: number;
}

export function Hero({ user, postCount, likeCount, commentCount }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/5 to-purple-500/20 p-8 md:p-10 shadow-lg border border-primary/10">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 animate-gradient-x" />
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3" />
              Welcome back
            </Badge>
            <Badge variant="outline" className="gap-1 bg-background/50 backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Good to see you,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {user.username}
            </span>
            👋
          </h1>
          <p className="text-muted-foreground text-base max-w-md">
            Share what's happening in your world and connect with others.
          </p>
        </div>

        {/* Stats – more compact and card-like */}
        <div className="flex items-center gap-4 bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/40 shadow-sm">
          <div className="text-center px-3">
            <p className="text-2xl font-bold">{postCount}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Posts</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center px-3">
            <p className="text-2xl font-bold">{likeCount}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Likes</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center px-3">
            <p className="text-2xl font-bold">{commentCount}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Comments</p>
          </div>
        </div>
      </div>
    </div>
  );
}