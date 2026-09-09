// src/app/(dashboard)/categories/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import CategoriesStats from '@/components/dashboard/categories/categories-stats'
import CategoriesActions from '@/components/dashboard/categories/categories-actions'
import CategoriesFilters from '@/components/dashboard/categories/categories-filters'
import CategoriesDataTable from '@/components/dashboard/categories/categories-data-table-optimized'
import { useCategoriesFilters } from '@/lib/hooks/use-categories-filters'

export default function CategoriesPage() {
  const filtersHook = useCategoriesFilters()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Force refresh when filters change
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [filtersHook.debouncedSearch, filtersHook.filters.status, filtersHook.filters.parent, filtersHook.filters.sort])

  // Callback pour forcer un refresh depuis les actions (ajout, modification, suppression)
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header avec breadcrumb */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>Tableau de bord</span>
          <span>›</span>
          <span className="text-gray-900 font-bold">Catégories</span>
        </nav>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Catégories produits</h1>
            <p className="text-xs text-gray-500 mt-0.5">Gérez l'arborescence et l'organisation des articles sur EVA SHOE</p>
          </div>
          <CategoriesActions onRefresh={handleRefresh} />
        </div>
      </div>

      {/* Statistiques */}
      <CategoriesStats key={refreshTrigger} />

      {/* Filtres et actions */}
      <CategoriesFilters filtersHook={filtersHook} />

      {/* Tableau de données */}
      <CategoriesDataTable 
        refreshTrigger={refreshTrigger}
        filters={filtersHook.apiFilters}
        filtersHook={filtersHook}
        onRefresh={handleRefresh}
      />
    </div>
  )
}
