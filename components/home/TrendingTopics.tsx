// components/home/TrendingTopics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TrendingTopicsProps {
  topics: Array<{ tag: string; count: number }>;
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <Card className="border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trending
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {topics.map((topic, index) => (
          <div
            key={topic.tag}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground">
                #{index + 1}
              </span>
              <span className="text-sm font-medium">{topic.tag}</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {topic.count} posts
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}