// app/login/page.tsx
import { AuthForm } from '@/components/auth/AuthForm'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { loginUser } from '@/app/actions/auth'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to continue your journey and connect with your community."
    >
      <AuthForm type="login" onSubmit={loginUser} />
    </AuthLayout>
  )
}