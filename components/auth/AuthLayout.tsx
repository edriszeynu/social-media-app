// components/auth/AuthLayout.tsx
'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Users, Zap } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left Column – Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center space-y-6 p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10 rounded-2xl border border-border/40 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              SocialApp
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {subtitle}
          </p>

          <div className="space-y-4 pt-4">
            {[
              { icon: Users, text: 'Connect with people around the world' },
              { icon: Zap, text: 'Share your thoughts instantly' },
              { icon: Shield, text: 'Your data is secure and private' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="pt-6 border-t border-border/40">
            <p className="text-xs text-muted-foreground">
              © 2026 SocialApp. All rights reserved.
            </p>
          </div>
        </motion.div>

        {/* Right Column – Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-md">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}