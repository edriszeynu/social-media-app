// components/PostDetail.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Heart, MessageCircle, Trash2, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toggleLike, addComment, deletePost } from '@/app/actions/posts'

interface PostDetailProps {
  post: Post
  currentUserId: string
}

export function PostDetail({ post: initialPost, currentUserId }: PostDetailProps) {
  const router = useRouter()
  const [post, setPost] = useState(initialPost)
  const [commentInput, setCommentInput] = useState('')
  const [isPending, startTransition] = useTransition()

  const isLiked = post.isLiked
  const isAuthor = post.author.id === currentUserId

  const handleLike = () => {
    startTransition(async () => {
      const newLikes = isLiked
        ? post.likes.filter((id) => id !== currentUserId)
        : [...post.likes, currentUserId]
      setPost((p) => ({ ...p, likes: newLikes, isLiked: !isLiked, likesCount: newLikes.length }))
      await toggleLike(post.id)
    })
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim()) return
    const content = commentInput.trim()
    setCommentInput('')
    const newComment = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      author: { id: currentUserId, username: 'You', avatar: null },
    }
    setPost((p) => ({ ...p, comments: [...p.comments, newComment] }))
    await addComment(post.id, content)
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deletePost(post.id)
      router.push('/')
    })
  }

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="overflow-hidden border-border/40">
        {/* Author */}
        <CardHeader className="flex flex-row items-center gap-3 p-5">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="h-11 w-11 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={post.author.avatar ?? undefined} alt={post.author.username} />
              <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.author.username}`}>
              <p className="font-semibold hover:underline">{post.author.username}</p>
            </Link>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          {isAuthor && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isPending}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>

        {/* Content */}
        <CardContent className="px-5 pb-4 space-y-4">
          <p className="text-base whitespace-pre-wrap leading-relaxed">{post.content}</p>
          {post.imageUrl && (
            <div className="relative w-full h-96 rounded-xl overflow-hidden bg-muted">
              <Image src={post.imageUrl} alt="Post image" fill className="object-cover" />
            </div>
          )}
        </CardContent>

        {/* Actions */}
        <CardFooter className="flex flex-col px-5 pb-5 pt-0 gap-4">
          <div className="flex items-center gap-4 w-full">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleLike}
              disabled={isPending}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
              <span className="font-medium">{post.likesCount}</span>
              <span className="text-xs">likes</span>
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{post.comments.length}</span>
              <span className="text-xs">comments</span>
            </div>
          </div>

          <Separator />

          {/* Comments list */}
          <div className="w-full space-y-3 max-h-96 overflow-y-auto">
            {post.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Be the first!
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.author.avatar ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {comment.author.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/40 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{comment.author.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment input */}
          <form onSubmit={handleComment} className="flex gap-2 w-full">
            <Input
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 h-10 text-sm"
            />
            <Button type="submit" size="sm" className="h-10 px-4 gap-2" disabled={!commentInput.trim()}>
              <Send className="h-4 w-4" />
              Comment
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
