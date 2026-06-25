// components/navbar/Navbar.tsx
import { getSession } from '@/lib/session'
import { Logo } from './Logo'
import { SearchBar } from './SearchBar'
import { NavActions } from './NavActions'
import { UserDropdown } from './UserDropdown'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { logoutUser } from '@/app/actions/auth'
import { LogOut } from 'lucide-react'

export async function Navbar() {
  const session = await getSession()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Logo />

        <div className="flex items-center flex-1 justify-end md:justify-center gap-2 md:gap-4">
          <SearchBar />

          <div className="hidden md:flex items-center gap-2">
            <NavActions messageCount={5} notificationCount={3} />
          </div>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <form action={logoutUser}>
                  <Button variant="ghost" size="sm" type="submit" className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </form>
                <UserDropdown session={session} />
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          <MobileMenu session={session} />
        </div>
      </div>
    </nav>
  )
}