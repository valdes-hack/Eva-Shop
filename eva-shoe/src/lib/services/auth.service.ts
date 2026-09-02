// src/lib/services/auth.service.ts
import { createClient } from '@/lib/supabase/client'
import type { 
  RegisterFormData, 
  LoginFormData,
} from '@/lib/validations/auth.validations'

const supabase = createClient()

// =====================================================
// INSCRIPTION
// =====================================================
export async function signUp(data: RegisterFormData) {
  const { email, password, first_name, last_name, phone } = data

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        phone,
      },
    },
  })

  if (error) {
    console.error('Erreur inscription:', error)
    throw error
  }

  return authData
}

// =====================================================
// CONNEXION
// =====================================================
export async function signIn(data: LoginFormData) {
  const { email, password } = data

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Erreur connexion:', error)
    throw error
  }

  return authData
}

// =====================================================
// DÉCONNEXION
// =====================================================
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Erreur déconnexion:', error)
    throw error
  }

  return true
}

// =====================================================
// MOT DE PASSE OUBLIÉ
// =====================================================
export async function forgotPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    console.error('Erreur mot de passe oublié:', error)
    throw error
  }

  return true
}

// =====================================================
// RÉINITIALISER MOT DE PASSE
// =====================================================
export async function resetPassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    console.error('Erreur réinitialisation mot de passe:', error)
    throw error
  }

  return true
}