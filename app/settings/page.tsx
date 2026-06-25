// app/settings/page.tsx
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SettingsClient } from '@/components/SettingsClient'

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, email: true, avatar: true, bio: true },
  })
  if (!user) redirect('/login')

  return <SettingsClient user={user} />
}
