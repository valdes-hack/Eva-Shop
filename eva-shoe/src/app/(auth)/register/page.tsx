// src/app/(auth)/register/page.tsx
import RegisterForm from '@/components/auth/register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inscription - EVA SHOE',
  description: 'Créez votre compte EVA SHOE et découvrez nos collections exclusives',
}

export default function RegisterPage() {
  return <RegisterForm />
}