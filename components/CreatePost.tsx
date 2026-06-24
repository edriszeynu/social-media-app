// components/CreatePost.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@/lib/dummy-data";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface CreatePostProps {
  onPostCreated: (content: string, imageUrl?: string) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onPostCreated(content, imageUrl || undefined);
      setContent("");
      setImageUrl("");
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1"
            />
          </div>

          {imageUrl && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setImageUrl("")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Input
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-9 text-sm w-48"
              />
              <Button type="button" variant="outline" size="sm" className="h-9">
                <ImageIcon className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <Button type="submit" disabled={!content.trim()} size="sm">
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}