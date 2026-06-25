// components/CreatePost.tsx
'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Image as ImageIcon, X, Loader2, Send } from 'lucide-react'
import Image from 'next/image'
import { createPost } from '@/app/actions/posts'

interface CreatePostProps {
  username: string
  avatar?: string | null
  onPostCreated: (content: string, imageUrl?: string) => void
}

export function CreatePost({ username, avatar, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const postContent = content.trim()
    const postImageUrl = imageUrl.trim() || undefined

    startTransition(async () => {
      const formData = new FormData()
      formData.append('content', postContent)
      if (postImageUrl) formData.append('imageUrl', postImageUrl)

      const result = await createPost(formData)
      if (!result?.error) {
        onPostCreated(postContent, postImageUrl)
        setContent('')
        setImageUrl('')
        setShowImageInput(false)
      }
    })
  }

  return (
    <Card className="border-border/40">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0 mt-1">
              <AvatarImage src={avatar ?? undefined} alt={username} />
              <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 min-h-[80px] resize-none text-sm"
              disabled={isPending}
            />
          </div>

          {showImageInput && (
            <div className="flex items-center gap-2 pl-13">
              <Input
                placeholder="Paste image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 h-9 text-sm"
                disabled={isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => { setImageUrl(''); setShowImageInput(false) }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {imageUrl && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowImageInput(!showImageInput)}
              disabled={isPending}
            >
              <ImageIcon className="h-4 w-4" />
              Photo
            </Button>

            <Button
              type="submit"
              size="sm"
              className="gap-2"
              disabled={!content.trim() || isPending}
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Posting...</>
              ) : (
                <><Send className="h-4 w-4" /> Post</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
