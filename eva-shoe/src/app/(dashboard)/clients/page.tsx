// src/app/(dashboard)/clients/page.tsx
'use client'

import Breadcrumb, { useDashboardBreadcrumb } from '@/components/dashboard/common/breadcrumb'

export default function ClientsPage() {
  const breadcrumb = useDashboardBreadcrumb()

  const breadcrumbItems = [
    breadcrumb.dashboard(),
    breadcrumb.clients()
  ]

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des clients</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Gérez vos clients et leurs informations
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Module clients</h2>
          <p className="text-gray-600">
            Le système de gestion des clients sera disponible prochainement
          </p>
        </div>
      </div>
    </div>
  )
}