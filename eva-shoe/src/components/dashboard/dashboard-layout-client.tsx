// src/components/dashboard/dashboard-layout-client.tsx
'use client'

import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/lib/types/auth.types'
import DashboardSidebar from '@/components/dashboard/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard/dashboard-header'

interface DashboardLayoutClientProps {
  user: User
  profile: UserProfile | null
  children: React.ReactNode
}

export default function DashboardLayoutClient({
  user,
  profile,
  children
}: DashboardLayoutClientProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedState = localStorage.getItem('sidebar_collapsed')
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true')
    }
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar_collapsed', String(next))
      return next
    })
  }

  // Prevent hydration mismatch during initial mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar 
          profile={profile} 
          isMobileOpen={false}
          isCollapsed={false}
          onCloseMobile={() => {}}
          onToggleCollapse={() => {}}
        />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <DashboardHeader user={user} profile={profile} />
          <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component (Flex child on Desktop, Fixed drawer on Mobile) */}
      <DashboardSidebar 
        profile={profile} 
        isMobileOpen={isMobileOpen}
        isCollapsed={isCollapsed} 
        onCloseMobile={() => setIsMobileOpen(false)}
        onToggleCollapse={toggleCollapse} 
      />

      {/* Main content wrapper (Flex-1 child sitting side-by-side with Desktop Sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300">
        {/* Header */}
        <DashboardHeader 
          user={user} 
          profile={profile} 
          onToggleSidebar={() => setIsMobileOpen(prev => !prev)}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
