// components/NotificationsClient.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  read: boolean
  createdAt: Date
  postId: string | null
  actor: { id: string; username: string; avatar: string | null }
}

export function NotificationsClient({ notifications }: { notifications: Notification[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-4 w-4 text-red-500" />
      case 'comment': return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'follow': return <UserPlus className="h-4 w-4 text-green-500" />
      default: return <Bell className="h-4 w-4 text-primary" />
    }
  }

  const getText = (type: string) => {
    switch (type) {
      case 'like': return 'liked your post'
      case 'comment': return 'commented on your post'
      case 'follow': return 'started following you'
      default: return 'sent you a notification'
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Recent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.postId ? `/post/${n.postId}` : `/profile/${n.actor.username}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 ${!n.read ? 'bg-primary/5' : ''}`}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={n.actor.avatar ?? undefined} />
                  <AvatarFallback>{n.actor.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{n.actor.username}</span>
                    {' '}{getText(n.type)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="shrink-0">{getIcon(n.type)}</div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
