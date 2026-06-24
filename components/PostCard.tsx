// components/PostCard.tsx
"use client";

import { useState } from "react";
import { Post } from "@/lib/dummy-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Trash2, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onDelete: (postId: string) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export function PostCard({ post, currentUserId, onDelete, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const isLiked = post.likes.includes(currentUserId);
  const isAuthor = post.author.id === currentUserId;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      onComment(post.id, commentInput);
      setCommentInput("");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/40">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/profile/${post.author.username}`}>
          <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link href={`/profile/${post.author.username}`}>
            <p className="font-semibold hover:underline text-sm">{post.author.username}</p>
          </Link>
          <p className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        {isAuthor && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(post.id)}
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="px-4 pb-2 space-y-3">
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-muted">
            <Image src={post.imageUrl} alt="Post image" fill className="object-cover" />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col p-4 pt-2">
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
            onClick={() => onLike(post.id)}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
            <span>{post.likes.length}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments.length}</span>
          </Button>
        </div>

        <Separator className="my-3" />

        {showComments && (
          <div className="w-full space-y-3">
            <div className="max-h-40 overflow-y-auto space-y-2">
              {post.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {comment.author.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 rounded-lg px-3 py-1.5 flex-1">
                      <p className="text-xs font-semibold">{comment.author.username}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 h-9 text-sm"
              />
              <Button type="submit" size="sm" className="h-9 px-3">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}