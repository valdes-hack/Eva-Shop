// src/lib/hooks/use-auth.ts
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/lib/types/auth.types'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  const supabase = createClient()

  useEffect(() => {
    // Récupérer l'utilisateur initial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Récupérer le profil
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error) {
            console.error('Erreur récupération profil:', error)
            setState({
              user: session.user,
              profile: null,
              loading: false,
              error: error.message,
            })
          } else {
            setState({
              user: session.user,
              profile: profile as UserProfile,
              loading: false,
              error: null,
            })
          }
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      } catch (error: any) {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: error.message,
        })
      }
    }

    getInitialSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Récupérer le profil
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setState({
            user: session.user,
            profile: profile as UserProfile || null,
            loading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const refresh = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setState({
          user: session.user,
          profile: profile as UserProfile || null,
          loading: false,
          error: error ? error.message : null,
        })
      } else {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: null,
        })
      }
    } catch (error: any) {
      setState({
        user: null,
        profile: null,
        loading: false,
        error: error.message,
      })
    }
  }

  return {
    ...state,
    refresh,
    isAuthenticated: !!state.user,
    isAdmin: state.profile?.role === 'admin',
    isManager: state.profile?.role === 'manager',
  }
}