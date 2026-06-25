import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const secret = process.env.JWT_SECRET

  if (!token) return NextResponse.json({ status: 'no_cookie' })
  if (!secret) return NextResponse.json({ status: 'no_secret' })

  try {
    const decoded = jwt.verify(token, secret)
    return NextResponse.json({ status: 'valid', decoded })
  } catch (err: unknown) {
    return NextResponse.json({
      status: 'invalid',
      error: err instanceof Error ? err.message : String(err),
      tokenPreview: token.substring(0, 30),
    })
  }
}
