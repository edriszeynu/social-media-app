// app/actions/social.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function toggleFollow(targetUserId: string) {
  const session = await getSession()
  if (!session || session.userId === targetUserId) return

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.userId,
        followingId: targetUserId,
      },
    },
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
  } else {
    await prisma.follow.create({
      data: { followerId: session.userId, followingId: targetUserId },
    })
    // Notify the followed user
    await prisma.notification.create({
      data: {
        type: 'follow',
        recipientId: targetUserId,
        actorId: session.userId,
      },
    })
  }

  revalidatePath('/')
}
