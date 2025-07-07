'use server'

import { cookies } from 'next/headers'

const ADMIN_EMAIL = 'admin@test.com'
const ADMIN_PASSWORD = 'testpass10'
const SESSION_COOKIE_NAME = 'admin-session'

interface LoginCredentials {
  email: string
  password: string
}

export async function login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
  try {
    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
      // Set a simple session cookie
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      return { success: true }
    } else {
      return { success: false, error: 'Invalid email or password' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE_NAME)
    return session?.value === 'authenticated'
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}