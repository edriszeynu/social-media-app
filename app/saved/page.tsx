// app/saved/page.tsx
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Bookmark } from 'lucide-react'

export default async function SavedPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Saved Posts</h1>
      <Card className="border-border/40">
        <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
          <Bookmark className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-muted-foreground font-medium">No saved posts yet</p>
          <p className="text-sm text-muted-foreground/60 text-center max-w-xs">
            Save posts to read them later. This feature is coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
