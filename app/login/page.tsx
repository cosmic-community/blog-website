import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import LoginForm from '@/components/LoginForm'

export const metadata = {
  title: 'Admin Login - Blog Website',
  description: 'Sign in to access the admin dashboard',
}

export default async function LoginPage() {
  const authenticated = await isAuthenticated()
  
  if (authenticated) {
    redirect('/dashboard')
  }

  return <LoginForm />
}