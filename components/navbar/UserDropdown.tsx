// components/navbar/UserDropdown.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Heart, Settings, LogOut } from 'lucide-react'
import { logoutUser } from '@/app/actions/auth'

interface UserDropdownProps {
  session: {
    userId: string
    username: string
    email: string
  }
}

export function UserDropdown({ session }: UserDropdownProps) {
  // We'll fetch user avatar from database, but for now use placeholder
  const avatarUrl = `https://i.pravatar.cc/150?u=${session.userId}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-primary/40 transition-all duration-200"
        >
          <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
            <AvatarImage src={avatarUrl} alt={session.username} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground">
              {session.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl border-border/40 bg-background/95 backdrop-blur-xl shadow-xl"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{session.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-muted/50 hover:text-primary transition-colors duration-200">
            <User className="mr-2 h-4 w-4" />
            <Link href={`/profile/${session.username}`} className="w-full">My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-muted/50 hover:text-primary transition-colors duration-200">
            <Heart className="mr-2 h-4 w-4" />
            <Link href="/saved" className="w-full">Saved Posts</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-muted/50 hover:text-primary transition-colors duration-200">
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings" className="w-full">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logoutUser}>
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors duration-200">
            <button type="submit" className="w-full flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}