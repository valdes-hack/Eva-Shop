// src/lib/services/user-server.service.ts
import { createClient } from '@/lib/supabase/server'
import type { UserProfile } from '@/lib/types/auth.types'

// =====================================================
// RÉCUPÉRER LE PROFIL UTILISATEUR CONNECTÉ (SERVER)
// =====================================================
export async function getCurrentUserProfileServer() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erreur getCurrentUserProfileServer:', error)
    return null
  }

  return { user, profile: data as UserProfile }
}