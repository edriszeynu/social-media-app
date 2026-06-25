// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// No redirect logic — all auth handled in server components
export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
