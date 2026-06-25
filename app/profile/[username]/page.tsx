// app/profile/[username]/page.tsx
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { ProfileClient } from '@/components/ProfileClient'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { username } = await params

  const profileUser = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true, username: true, email: true, avatar: true, bio: true,
      _count: { select: { posts: true, followers: true, following: true } },
      followers: { select: { followerId: true } },
    },
  })
  if (!profileUser) notFound()

  const posts = await prisma.post.findMany({
    where: { authorId: profileUser.id },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      likes: { select: { userId: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { id: true, username: true, avatar: true } } },
      },
    },
  })

  const formattedPosts = posts.map((post) => ({
    ...post,
    imageUrl: post.imageUrl || null,
    createdAt: post.createdAt.toISOString(),
    likes: post.likes.map((l) => l.userId),
    isLiked: post.likes.some((l) => l.userId === session.userId),
    likesCount: post.likes.length,
    comments: post.comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      author: { id: c.author.id, username: c.author.username, avatar: c.author.avatar },
    })),
  }))

  const isFollowing = profileUser.followers.some((f) => f.followerId === session.userId)
  const isOwnProfile = session.userId === profileUser.id

  return (
    <ProfileClient
      profileUser={profileUser}
      posts={formattedPosts}
      currentUserId={session.userId}
      isFollowing={isFollowing}
      isOwnProfile={isOwnProfile}
    />
  )
}
