// app/notifications/page.tsx
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { NotificationsClient } from '@/components/NotificationsClient'

export default async function NotificationsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const notifications = await prisma.notification.findMany({
    where: { recipientId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      actor: { select: { id: true, username: true, avatar: true } },
    },
  })

  return <NotificationsClient notifications={notifications} />
}
