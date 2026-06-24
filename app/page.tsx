// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { dummyPosts, currentUser, users, Post } from "@/lib/dummy-data";
import { PostCard } from "@/components/PostCard";
import { CreatePost } from "@/components/CreatePost";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/home/Hero";
import { UserStats } from "@/components/home/UserStats";
import { TrendingTopics } from "@/components/home/TrendingTopics";
import { SuggestedUsers } from "@/components/home/SuggestedUsers";
import { RecentActivity } from "@/components/home/RecentActivity";
import { Sparkles } from "lucide-react";

// Data (could be moved to a separate file)
const trendingTopics = [
  { tag: "#NextJS", count: 42 },
  { tag: "#React", count: 38 },
  { tag: "#TailwindCSS", count: 35 },
  { tag: "#Prisma", count: 27 },
  { tag: "#MongoDB", count: 23 },
  { tag: "#FullStack", count: 19 },
];

const suggestedUsers = users.filter((u) => u.id !== currentUser.id);

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [isLoaded, setIsLoaded] = useState(false);

  // Entrance animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // ✅ REMOVE SCROLLBAR – adds class to both <html> and <body>
  useEffect(() => {
    document.documentElement.classList.add('no-scrollbar');
    document.body.classList.add('no-scrollbar');

    return () => {
      document.documentElement.classList.remove('no-scrollbar');
      document.body.classList.remove('no-scrollbar');
    };
  }, []);

  // Post handlers
  const handleNewPost = (content: string, imageUrl?: string) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      author: currentUser,
      content,
      imageUrl,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleToggleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(currentUser.id);
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter((id) => id !== currentUser.id)
              : [...post.likes, currentUser.id],
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c${Date.now()}`,
            author: currentUser,
            content,
            createdAt: new Date().toISOString(),
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);
  const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);

  return (
    <div className={`space-y-8 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* Hero Section */}
      <Hero
        user={currentUser}
        postCount={posts.length}
        likeCount={totalLikes}
        commentCount={totalComments}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          <CreatePost onPostCreated={handleNewPost} />

          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2 border-border/30">
                <div className="flex flex-col items-center gap-3">
                  <Sparkles className="h-12 w-12 text-primary/40" />
                  <p className="text-lg font-medium text-muted-foreground">No posts yet</p>
                  <p className="text-sm text-muted-foreground/60">
                    Be the first to share something with your community!
                  </p>
                </div>
              </Card>
            ) : (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PostCard
                    post={post}
                    currentUserId={currentUser.id}
                    onDelete={handleDeletePost}
                    onLike={handleToggleLike}
                    onComment={handleAddComment}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar – Desktop */}
        <aside className="hidden lg:block space-y-6 sticky top-24 h-fit">
          <UserStats
            postCount={posts.length}
            followerCount={0}
            followingCount={0}
          />
          <TrendingTopics topics={trendingTopics} />
          <SuggestedUsers users={suggestedUsers} maxDisplay={3} />
          <RecentActivity posts={posts} maxDisplay={3} />
        </aside>
      </div>

      {/* Sidebar – Mobile */}
      <div className="lg:hidden space-y-6 mt-8 border-t border-border/30 pt-8">
        <UserStats
          postCount={posts.length}
          followerCount={0}
          followingCount={0}
        />
        <TrendingTopics topics={trendingTopics} />
        <SuggestedUsers users={suggestedUsers} maxDisplay={3} />
        <RecentActivity posts={posts} maxDisplay={3} />
      </div>
    </div>
  );
}