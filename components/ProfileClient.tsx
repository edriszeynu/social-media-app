// components/ProfileClient.tsx
'use client'

import { useState, useTransition } from 'react'
import { Post } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PostCard } from '@/components/PostCard'
import { toggleFollow } from '@/app/actions/social'
import { toggleLike, addComment, deletePost } from '@/app/actions/posts'
import { UserCheck, UserPlus, MapPin, Link as LinkIcon, Loader2 } from 'lucide-react'

interface ProfileUser {
  id: string
  username: string
  email: string
  avatar: string | null
  bio: string | null
  _count: { posts: number; followers: number; following: number }
}

interface ProfileClientProps {
  profileUser: ProfileUser
  posts: Post[]
  currentUserId: string
  isFollowing: boolean
  isOwnProfile: boolean
}

export function ProfileClient({ profileUser, posts: initialPosts, currentUserId, isFollowing: initialIsFollowing, isOwnProfile }: ProfileClientProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followerCount, setFollowerCount] = useState(profileUser._count.followers)
  const [isPending, startTransition] = useTransition()

  const handleFollow = () => {
    startTransition(async () => {
      await toggleFollow(profileUser.id)
      setIsFollowing((prev) => !prev)
      setFollowerCount((prev) => isFollowing ? prev - 1 : prev + 1)
    })
  }

  const handleDelete = async (postId: string) => {
    startTransition(async () => {
      await deletePost(postId)
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    })
  }

  const handleLike = async (postId: string) => {
    startTransition(async () => {
      setPosts((prev) => prev.map((post) => {
        if (post.id !== postId) return post
        const liked = post.isLiked
        const newLikes = liked ? post.likes.filter((id) => id !== currentUserId) : [...post.likes, currentUserId]
        return { ...post, likes: newLikes, isLiked: !liked, likesCount: newLikes.length }
      }))
      await toggleLike(postId)
    })
  }

  const handleComment = async (postId: string, content: string) => {
    const newComment = {
      id: `temp-${Date.now()}`, content, createdAt: new Date().toISOString(),
      author: { id: currentUserId, username: 'You', avatar: null },
    }
    setPosts((prev) => prev.map((post) =>
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
    ))
    await addComment(postId, content)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile header */}
      <Card className="border-border/40">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={profileUser.avatar ?? undefined} alt={profileUser.username} />
              <AvatarFallback className="text-2xl">{profileUser.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold">{profileUser.username}</h1>
                  <p className="text-sm text-muted-foreground">{profileUser.email}</p>
                </div>
                {!isOwnProfile && (
                  <Button
                    onClick={handleFollow}
                    disabled={isPending}
                    variant={isFollowing ? 'outline' : 'default'}
                    size="sm"
                    className="gap-2"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> :
                      isFollowing ? <><UserCheck className="h-4 w-4" /> Following</> :
                      <><UserPlus className="h-4 w-4" /> Follow</>}
                  </Button>
                )}
              </div>

              {profileUser.bio && (
                <p className="text-sm text-muted-foreground">{profileUser.bio}</p>
              )}

              <div className="flex gap-6 pt-1">
                <div className="text-center">
                  <p className="font-bold text-lg">{profileUser._count.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="font-bold text-lg">{followerCount}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="font-bold text-lg">{profileUser._count.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Posts</h2>
        {posts.length === 0 ? (
          <Card className="border-dashed border-2 border-border/30">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No posts yet.</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </div>
    </div>
  )
}
