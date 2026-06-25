// app/actions/auth.ts
'use server'

import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'
import { registerSchema, loginSchema } from '@/lib/validations/auth'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function registerUser(formData: FormData) {
  const rawData = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  // Validate with Zod
  const result = registerSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const { username, email, password } = result.data

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })
  if (existingUser) {
    if (existingUser.email === email) return { error: 'Email already registered' }
    if (existingUser.username === username) return { error: 'Username already taken' }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  })

  // Create session
  await createSession({
    userId: user.id,
    username: user.username,
    email: user.email,
  })

  return { success: true }
}

export async function loginUser(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = loginSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const { email, password } = result.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { error: 'Invalid email or password' }
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return { error: 'Invalid email or password' }
  }

  await createSession({
    userId: user.id,
    username: user.username,
    email: user.email,
  })

  return { success: true }
}

export async function logoutUser() {
  await deleteSession()
  redirect('/login')
}