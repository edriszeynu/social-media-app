// components/HomePageClient.tsx
'use client'

import { useState, useTransition } from 'react'
import { Post, User } from '@/lib/types'
import { PostCard } from '@/components/PostCard'
import { CreatePost } from '@/components/CreatePost'
import { Card } from '@/components/ui/card'
import { Hero } from '@/components/home/Hero'
import { UserStats } from '@/components/home/UserStats'
import { TrendingTopics } from '@/components/home/TrendingTopics'
import { SuggestedUsers } from '@/components/home/SuggestedUsers'
import { RecentActivity } from '@/components/home/RecentActivity'
import { Sparkles } from 'lucide-react'
import { deletePost, toggleLike, addComment } from '@/app/actions/posts'

interface FullUser extends User {
  _count: {
    posts: number
    followers: number
    following: number
  }
}

interface HomePageClientProps {
  initialPosts: Post[]
  session: {
    userId: string
    username: string
    email: string
  }
  user: FullUser
  suggestedUsers: User[]
}

export function HomePageClient({ initialPosts, session, user, suggestedUsers }: HomePageClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isPending, startTransition] = useTransition()

  const handleNewPost = async (content: string, imageUrl?: string) => {
    // Optimistically add to feed — server already saved via createPost action
    const newPost = {
      id: `temp-${Date.now()}`,
      content,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
      author: { id: user.id, username: user.username, avatar: user.avatar },
      likes: [],
      isLiked: false,
      likesCount: 0,
      comments: [],
    }
    setPosts((prev) => [newPost, ...prev])
  }

  const handleDelete = async (postId: string) => {
    startTransition(async () => {
      await deletePost(postId)
      setPosts(posts.filter((p) => p.id !== postId))
    })
  }

  const handleLike = async (postId: string) => {
    startTransition(async () => {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const isLiked = post.isLiked
            const newLikes = isLiked
              ? post.likes.filter((id) => id !== session.userId)
              : [...post.likes, session.userId]
            return { ...post, likes: newLikes, isLiked: !isLiked, likesCount: newLikes.length }
          }
          return post
        })
      )
      await toggleLike(postId)
    })
  }

  const handleComment = async (postId: string, content: string) => {
    const newComment = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      author: { id: session.userId, username: session.username, avatar: null },
    }
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
      )
    )
    await addComment(postId, content)
  }

  const totalLikes = posts.reduce((acc, post) => acc + post.likesCount, 0)
  const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0)

  // Derive trending topics from post content hashtags
  const hashtagCounts: Record<string, number> = {}
  for (const post of posts) {
    const tags = post.content.match(/#\w+/g) || []
    for (const tag of tags) {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
    }
  }
  const trendingTopics = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))

  return (
    <div className="space-y-8">
      <Hero
        user={user}
        postCount={user._count.posts}
        likeCount={totalLikes}
        commentCount={totalComments}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CreatePost
              username={user.username}
              avatar={user.avatar}
              onPostCreated={handleNewPost}
            />

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
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={session.userId}
                onDelete={handleDelete}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))
          )}
        </div>

        <aside className="hidden lg:block space-y-6 sticky top-24 h-fit">
          <UserStats
            postCount={user._count.posts}
            followerCount={user._count.followers}
            followingCount={user._count.following}
          />
          {trendingTopics.length > 0 && <TrendingTopics topics={trendingTopics} />}
          <SuggestedUsers users={suggestedUsers} maxDisplay={3} />
          <RecentActivity posts={posts} maxDisplay={3} />
        </aside>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden space-y-6 mt-8 border-t border-border/30 pt-8">
        <UserStats
          postCount={user._count.posts}
          followerCount={user._count.followers}
          followingCount={user._count.following}
        />
        {trendingTopics.length > 0 && <TrendingTopics topics={trendingTopics} />}
        <SuggestedUsers users={suggestedUsers} maxDisplay={3} />
        <RecentActivity posts={posts} maxDisplay={3} />
      </div>
    </div>
  )
}
