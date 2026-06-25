// app/register/page.tsx
import { AuthForm } from '@/components/auth/AuthForm'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { registerUser } from '@/app/actions/auth'

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join the community!"
      subtitle="Create your account and start connecting with people around the world."
    >
      <AuthForm type="register" onSubmit={registerUser} />
    </AuthLayout>
  )
}