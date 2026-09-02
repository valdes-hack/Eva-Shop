// src/app/(dashboard)/categories/page.tsx
import CategoriesStats from '@/components/dashboard/categories/categories-stats'
import CategoriesActions from '@/components/dashboard/categories/categories-actions'
import CategoriesFilters from '@/components/dashboard/categories/categories-filters'
import CategoriesDataTable from '@/components/dashboard/categories/categories-data-table'

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header avec breadcrumb */}
      <div>
        <nav className="flex text-sm text-gray-600 mb-4">
          <span>Tableau de bord</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">Catégories</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          </div>
          <CategoriesActions />
        </div>
      </div>

      {/* Statistiques */}
      <CategoriesStats />

      {/* Filtres et actions */}
      <CategoriesFilters />

      {/* Tableau de données */}
      <CategoriesDataTable />
    </div>
  )
}