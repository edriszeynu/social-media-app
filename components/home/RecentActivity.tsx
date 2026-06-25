// components/home/RecentActivity.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, Heart, MessageCircle } from "lucide-react";
import { Post } from '@/lib/types'

interface RecentActivityProps {
  posts: Post[];
  maxDisplay?: number;
}

export function RecentActivity({ posts, maxDisplay = 3 }: RecentActivityProps) {
  const displayPosts = posts.slice(0, maxDisplay);

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-2 flex-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback className="text-[10px]">
                  {post.author.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs">
                  <span className="font-medium">{post.author.username}</span>
                  {" posted a new update"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 ml-auto text-muted-foreground">
              <Heart className="h-3 w-3" />
              <span className="text-xs">{post.likes.length}</span>
              <MessageCircle className="h-3 w-3 ml-1" />
              <span className="text-xs">{post.comments.length}</span>
            </div>
          </div>
        ))}
        {displayPosts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        )}
      </CardContent>
    </Card>
  );
}