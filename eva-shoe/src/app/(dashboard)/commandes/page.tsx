// src/app/(dashboard)/commandes/page.tsx
'use client'

import Breadcrumb, { useDashboardBreadcrumb } from '@/components/dashboard/common/breadcrumb'

export default function CommandesPage() {
  const breadcrumb = useDashboardBreadcrumb()

  const breadcrumbItems = [
    breadcrumb.dashboard(),
    breadcrumb.orders()
  ]

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des commandes</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Suivez et gérez les commandes de vos clients
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Module commandes</h2>
          <p className="text-gray-600">
            Le système de commandes sera disponible après l'implémentation des produits
          </p>
        </div>
      </div>
    </div>
  )
}