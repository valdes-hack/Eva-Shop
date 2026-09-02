// src/lib/services/user.service.ts
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/types/auth.types'

// =====================================================
// RÉCUPÉRER LE PROFIL UTILISATEUR CONNECTÉ (CLIENT)
// =====================================================
export async function getCurrentUserProfile() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erreur getCurrentUserProfile:', error)
    throw error
  }

  return data as UserProfile
}

// =====================================================
// METTRE À JOUR LE PROFIL UTILISATEUR
// =====================================================
export async function updateUserProfile(updates: Partial<UserProfile>) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Erreur updateUserProfile:', error)
    throw error
  }

  return data as UserProfile
}

// =====================================================
// RÉCUPÉRER TOUTES LES ADRESSES DE L'UTILISATEUR
// =====================================================
export async function getUserAddresses() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur getUserAddresses:', error)
    throw error
  }

  return data
}

// =====================================================
// AJOUTER UNE NOUVELLE ADRESSE
// =====================================================
export async function createUserAddress(address: {
  address_line: string
  city: string
  postal_code?: string
  country: string
  is_default?: boolean
  type?: 'shipping' | 'billing' | 'both'
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  // Si c'est l'adresse par défaut, désactiver les autres
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert([{
      user_id: user.id,
      address_line: address.address_line,
      city: address.city,
      postal_code: address.postal_code,
      country: address.country || 'Cameroun',
      is_default: address.is_default || false,
      type: address.type || 'both',
    }])
    .select()
    .single()

  if (error) {
    console.error('Erreur createUserAddress:', error)
    throw error
  }

  return data
}