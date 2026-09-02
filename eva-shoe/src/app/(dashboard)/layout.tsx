// src/app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { getCurrentUserProfileServer } from '@/lib/services/user-server.service'
import DashboardSidebar from '@/components/dashboard/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard/dashboard-header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérifier que l'utilisateur est connecté et a les droits admin/manager
  const result = await getCurrentUserProfileServer()
  
  if (!result || !['admin', 'manager'].includes(result.profile?.role || '')) {
    redirect('/login')
  }

  const { user, profile } = result

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <DashboardSidebar profile={profile} />
      
      {/* Main content with left margin for sidebar */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <DashboardHeader user={user} profile={profile} />
        
        {/* Page content with independent scroll */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  )
}