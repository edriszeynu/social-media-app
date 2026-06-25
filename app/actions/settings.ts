// app/actions/settings.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function updateProfile({
  username,
  bio,
  avatar,
}: {
  username: string
  bio: string
  avatar: string
}) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  if (!username.trim()) return { error: 'Username is required' }

  // Check username taken by someone else
  const existing = await prisma.user.findUnique({ where: { username: username.trim() } })
  if (existing && existing.id !== session.userId) return { error: 'Username already taken' }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      username: username.trim(),
      bio: bio.trim() || null,
      avatar: avatar.trim() || null,
    },
  })

  revalidatePath('/settings')
  revalidatePath(`/profile/${username.trim()}`)
  return { success: true }
}
