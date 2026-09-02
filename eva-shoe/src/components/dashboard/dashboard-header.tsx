// src/components/dashboard/dashboard-header.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/services/auth.service'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/lib/types/auth.types'

interface DashboardHeaderProps {
  user: User
  profile: UserProfile | null
}

export default function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin': return 'Administrateur'
      case 'manager': return 'Manager'
      default: return 'Utilisateur'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page title will be dynamic based on current page */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre boutique EVA SHOE</p>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a8.38 8.38 0 010-11L21 3h-5V1h-2v2H9V1H7v2H2l4.5 4.5a8.38 8.38 0 010 11L2 21h5v2h2v-2h5v2h2v-2z" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#C89B3C] text-white rounded-full flex items-center justify-center font-medium text-sm">
                {getInitials(profile?.first_name, profile?.last_name)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-medium text-sm">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : user.email
                  }
                </div>
                <div className="text-xs text-gray-500">
                  {getRoleLabel(profile?.role)}
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-sm text-gray-900">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : user.email
                    }
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    router.push('/profil')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil
                </button>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    router.push('/dashboard/parametres')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </button>

                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  )
}