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
  onToggleSidebar?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function DashboardHeader({ 
  user, 
  profile, 
  onToggleSidebar,
  isCollapsed = false,
  onToggleCollapse 
}: DashboardHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [language, setLanguage] = useState('FR')
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
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'E'
  }

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin': return 'Vendeur / Admin'
      case 'manager': return 'Manager'
      default: return 'Vendeur vérifié'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Left section: Mobile & Desktop Toggle buttons & Title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-hidden"
              aria-label="Ouvrir le menu mobile"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Desktop collapse toggle button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h16" />
              </svg>
            </button>
          )}

          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">Dashboard Admin</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Boutique EVA SHOE — Market Cameroun & Afrique</p>
          </div>
        </div>

        {/* Right section: Language selector, Messages, Notifications & Profile menu */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language selector */}
          <div className="hidden sm:flex items-center bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700">
            <span className="mr-1">🇫🇷</span>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none focus:outline-hidden text-xs font-semibold text-gray-700 cursor-pointer"
            >
              <option value="FR">FR</option>
              <option value="EN">EN</option>
            </select>
          </div>

          {/* Messages button */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Messages client">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notifications button */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Notifications">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              8
            </span>
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 md:gap-3 p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-[#C89B3C] to-amber-500 text-black font-extrabold rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-sm border-2 border-white">
                {getInitials(profile?.first_name, profile?.last_name)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-xs leading-tight text-gray-900">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : 'Eva Store'
                  }
                </div>
                <div className="text-[11px] text-[#C89B3C] font-semibold">
                  {getRoleLabel(profile?.role)}
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                  <div className="font-bold text-sm text-gray-900 truncate">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : 'Eva Store'
                    }
                  </div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    👑 Vendeur vérifié
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    router.push('/profil')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50/50 hover:text-[#C89B3C] flex items-center gap-2 font-medium"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil boutique
                </button>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    router.push('/parametres')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50/50 hover:text-[#C89B3C] flex items-center gap-2 font-medium"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres boutique
                </button>

                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium disabled:opacity-50"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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