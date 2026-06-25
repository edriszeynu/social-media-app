// components/auth/AuthForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { SocialButtons } from './SocialButtons'

interface AuthFormProps {
  type: 'login' | 'register'
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const schema = type === 'login'
    ? z.object({
        email: z.string().email('Please enter a valid email'),
        password: z.string().min(1, 'Password is required'),
      })
    : z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        email: z.string().email('Please enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
      })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = async (values: FormValues) => {
    setIsPending(true)
    setError(null)

    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value)
    })

    try {
      const result = await onSubmit(formData)
      if (result && 'error' in result) {
        setError(result.error || 'Something went wrong')
      } else if (result && 'success' in result && result.success) {
        router.push('/')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  const isRegister = type === 'register'

  return (
    <Card className="w-full border-border/40 shadow-2xl shadow-primary/5 backdrop-blur-sm bg-background/95">
      <CardHeader className="space-y-2 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25 mx-auto mb-3">
            {isRegister ? (
              <User className="h-7 w-7 text-white" />
            ) : (
              <Lock className="h-7 w-7 text-white" />
            )}
          </div>
        </motion.div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isRegister
            ? 'Start your journey with SocialApp today'
            : 'Sign in to continue to your account'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {isRegister && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Choose a unique username"
                          className="pl-10 rounded-lg border-border/40 focus-visible:ring-primary/30"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 rounded-lg border-border/40 focus-visible:ring-primary/30"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                        className="pl-10 pr-10 rounded-lg border-border/40 focus-visible:ring-primary/30"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isRegister && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10 rounded-lg border-border/40 focus-visible:ring-primary/30"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {type === 'login' && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40"
              disabled={isPending}
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegister ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <SocialButtons />
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/40 pt-6 text-sm text-muted-foreground">
        {isRegister ? (
          <p>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline transition-colors"
            >
              Create one
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  )
}