// src/app/(dashboard)/produits/page.tsx
'use client'

import Breadcrumb, { useDashboardBreadcrumb } from '@/components/dashboard/common/breadcrumb'

export default function ProduitsPage() {
  const breadcrumb = useDashboardBreadcrumb()

  const breadcrumbItems = [
    breadcrumb.dashboard(),
    { label: 'Produits', isActive: true }
  ]

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des produits</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Gérez votre catalogue de produits EVA SHOE
            </p>
          </div>
          
          <button className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un produit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Système de produits en développement</h2>
          <p className="text-gray-600 mb-4">
            Le système d'attributs est maintenant prêt ! La gestion des produits avec les attributs sera implémentée dans la prochaine étape.
          </p>
          <p className="text-sm text-gray-500">
            ✅ Catégories configurées<br/>
            ✅ Attributs prêts (couleur, taille, pointure, marque, matière)<br/>
            🔄 Interface produits en cours...
          </p>
        </div>
      </div>
    </div>
  )
}