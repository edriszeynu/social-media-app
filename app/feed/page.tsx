// app/feed/page.tsx
import { getFeedPosts } from '@/app/actions/posts'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { HomePageClient } from '@/components/HomePageClient'

export default async function FeedPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true, username: true, email: true, avatar: true, bio: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  })
  if (!user) redirect('/login')

  const suggestedUsers = await prisma.user.findMany({
    where: { id: { not: session.userId } },
    select: { id: true, username: true, email: true, avatar: true, bio: true },
    take: 10,
  })

  const posts = await getFeedPosts()

  return <HomePageClient initialPosts={posts} session={session} user={user} suggestedUsers={suggestedUsers} />
}
