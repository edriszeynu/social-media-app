// app/page.tsx
import { getFeedPosts } from '@/app/actions/posts'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { HomePageClient } from '@/components/HomePageClient'

export default async function HomePage() {
  const session = await getSession()

  // '/' is public — unauthenticated users see a landing/guest view
  if (!session) {
    redirect('/login')
  }

  // Fetch full user data
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) redirect('/login')

  // Fetch suggested users (all users except current user)
  const suggestedUsers = await prisma.user.findMany({
    where: { id: { not: session.userId } },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
    },
    take: 10,
  })

  const posts = await getFeedPosts()

  return (
    <HomePageClient
      initialPosts={posts}
      session={session}
      user={user}
      suggestedUsers={suggestedUsers}
    />
  )
}
