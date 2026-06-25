// app/post/[id]/page.tsx
import { getPostById } from '@/app/actions/posts'
import { getSession } from '@/lib/session'
import { redirect, notFound } from 'next/navigation'
import { PostDetail } from '@/components/PostDetail'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <PostDetail post={post} currentUserId={session.userId} />
    </div>
  )
}
