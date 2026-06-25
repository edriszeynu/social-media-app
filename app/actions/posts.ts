// app/actions/posts.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Post } from '@/lib/types'

// ------------------------------------------------------------------
// 1. Fetch all posts for the feed (ordered newest first)
// ------------------------------------------------------------------
export async function getFeedPosts(): Promise<Post[]> {
  const session = await getSession()
  if (!session) return []

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
    },
  })

  // Transform to match the Post type from @/lib/types
  return posts.map((post) => ({
    ...post,
    imageUrl: post.imageUrl || null,
    likes: post.likes.map((like) => like.userId),
    isLiked: post.likes.some((like) => like.userId === session.userId),
    likesCount: post.likes.length,
    comments: post.comments.map((comment) => ({
      ...comment,
      author: {
        id: comment.author.id,
        username: comment.author.username,
        avatar: comment.author.avatar,
      },
    })),
  }))
}

// app/actions/posts.ts createPost — no redirect, return success
export async function createPost(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const content = formData.get('content') as string
  const imageUrl = (formData.get('imageUrl') as string) || undefined

  if (!content?.trim()) {
    return { error: 'Content cannot be empty' }
  }

  await prisma.post.create({
    data: {
      content: content.trim(),
      imageUrl,
      authorId: session.userId,
    },
  })

  revalidatePath('/')
  return { success: true }
}

// ------------------------------------------------------------------
// 3. Delete a post (only the author can delete)
// ------------------------------------------------------------------
export async function deletePost(postId: string) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })

  if (!post) throw new Error('Post not found')
  if (post.authorId !== session.userId) throw new Error('Forbidden')

  await prisma.post.delete({
    where: { id: postId },
  })

  revalidatePath('/')
}

// ------------------------------------------------------------------
// 4. Toggle like/unlike
// ------------------------------------------------------------------
export async function toggleLike(postId: string) {
  const session = await getSession()
  if (!session) return

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.userId,
        postId,
      },
    },
  })

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    })
  } else {
    await prisma.like.create({
      data: {
        userId: session.userId,
        postId,
      },
    })
  }

  revalidatePath('/')
}

// ------------------------------------------------------------------
// 6. Get a single post by ID
// ------------------------------------------------------------------
export async function getPostById(postId: string): Promise<Post | null> {
  const session = await getSession()
  if (!session) return null

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      likes: { select: { userId: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
      },
    },
  })

  if (!post) return null

  return {
    ...post,
    imageUrl: post.imageUrl || null,
    likes: post.likes.map((l) => l.userId),
    isLiked: post.likes.some((l) => l.userId === session.userId),
    likesCount: post.likes.length,
    comments: post.comments.map((c) => ({
      ...c,
      author: { id: c.author.id, username: c.author.username, avatar: c.author.avatar },
    })),
  }
}
export async function addComment(postId: string, content: string) {
  const session = await getSession()
  if (!session || !content?.trim()) return

  await prisma.comment.create({
    data: {
      content: content.trim(),
      authorId: session.userId,
      postId,
    },
  })

  revalidatePath('/')
}