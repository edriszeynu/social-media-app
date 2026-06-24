// components/home/UserStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, UserPlus, UserCheck } from "lucide-react";

interface UserStatsProps {
  postCount: number;
  followerCount?: number;
  followingCount?: number;
}

export function UserStats({ postCount, followerCount = 0, followingCount = 0 }: UserStatsProps) {
  return (
    <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4 text-primary" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
            <FileText className="h-5 w-5 text-primary/70" />
            <span className="text-2xl font-bold mt-1">{postCount}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Posts</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <UserPlus className="h-5 w-5 text-blue-500/70" />
            <span className="text-2xl font-bold mt-1">{followerCount}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
            <UserCheck className="h-5 w-5 text-purple-500/70" />
            <span className="text-2xl font-bold mt-1">{followingCount}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Following</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}