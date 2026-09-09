// src/app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { getCurrentUserProfileServer } from '@/lib/services/user-server.service'
import DashboardLayoutClient from '@/components/dashboard/dashboard-layout-client'

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
    <DashboardLayoutClient user={user} profile={profile}>
      {children}
    </DashboardLayoutClient>
  )
}