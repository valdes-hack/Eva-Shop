// src/app/(auth)/login/page.tsx
import LoginForm from '@/components/auth/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion - EVA SHOE',
  description: 'Connectez-vous à votre compte EVA SHOE',
}

export default function LoginPage() {
  return <LoginForm />
}