// src/lib/utils/auth-redirect.ts
import { createClient } from '@/lib/supabase/client'

/**
 * Redirige l'utilisateur vers la page appropriée selon son rôle
 */
export async function redirectBasedOnRole() {
  const supabase = createClient()
  
  try {
    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return '/' // Page d'accueil si pas connecté
    }

    // Récupérer le profil pour connaître le rôle
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Rediriger selon le rôle
    if (profile?.role === 'admin' || profile?.role === 'manager') {
      return '/dashboard'
    } else {
      return '/' // Page d'accueil pour les clients
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle:', error)
    return '/' // Page d'accueil par défaut en cas d'erreur
  }
}

/**
 * Vérifie si l'utilisateur a les droits admin/manager
 */
export async function checkAdminAccess(): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return profile?.role === 'admin' || profile?.role === 'manager'
    
  } catch (error) {
    console.error('Erreur lors de la vérification des droits admin:', error)
    return false
  }
}