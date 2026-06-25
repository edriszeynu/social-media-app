// lib/session.ts
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export interface SessionPayload {
  userId: string
  username: string
  email: string
}

export async function createSession(payload: SessionPayload) {
  const token = jwt.sign(payload, SECRET, { expiresIn: '7d' })
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, SECRET) as SessionPayload
    return decoded
  } catch {
    // Token is invalid or expired — clear it so the proxy stops looping
    cookieStore.delete('session')
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}