// src/components/dashboard/categories/categories-data-table-fixed.tsx
'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import Link from 'next/link'
import { getCategories, deleteCategory, bulkDeleteCategories } from '@/lib/services/category-optimized.service'
import type { Category } from '@/lib/types/category.types'

interface CategoriesDataTableProps {
  refreshTrigger?: number
  filters?: any
  filtersHook?: any
  onRefresh?: () => void
}

function CategoriesDataTableFixed({ refreshTrigger, filters, filtersHook, onRefresh }: CategoriesDataTableProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)

  // Chargement des catégories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Chargement des catégories avec filtres:', filters)
      
      const { data, count } = await getCategories(filters)
      
      setCategories(data)
      setTotalCount(count || 0)
      
      console.log(`✅ ${data.length} catégories chargées`)
    } catch (error) {
      console.error('❌ Erreur loadCategories:', error)
      setError('Impossible de charger les catégories')
      setCategories([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Effect pour recharger quand les filtres ou refreshTrigger changent
  useEffect(() => {
    loadCategories()
  }, [loadCategories, refreshTrigger])

  // Gestion de la sélection
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const toggleAllSelection = useCallback(() => {
    setSelectedIds(prev => {
      if (prev.size === categories.length) {
        return new Set() // Tout désélectionner
      } else {
        return new Set(categories.map(c => c.id)) // Tout sélectionner
      }
    })
  }, [categories])

  // Supprimer une catégorie
  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)) return
    
    try {
      setActionLoading(true)
      await deleteCategory(id)
      
      // Refresh immédiat
      if (onRefresh) {
        onRefresh()
      } else {
        await loadCategories()
      }
      
      // Retirer de la sélection si sélectionné
      setSelectedIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error)
      alert('Impossible de supprimer la catégorie')
    } finally {
      setActionLoading(false)
    }
  }, [loadCategories, onRefresh])

  // Supprimer en lot
  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return
    
    const count = selectedIds.size
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${count} catégorie(s) sélectionnée(s) ?`)) return
    
    try {
      setActionLoading(true)
      await bulkDeleteCategories(Array.from(selectedIds))
      
      setSelectedIds(new Set())
      
      // Refresh immédiat
      if (onRefresh) {
        onRefresh()
      } else {
        await loadCategories()
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression en lot:', error)
      alert('Impossible de supprimer les catégories')
    } finally {
      setActionLoading(false)
    }
  }, [selectedIds, loadCategories, onRefresh])

  // Badge de statut
  const getStatusBadge = useCallback((isActive: boolean) => {
    if (!isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Masquée</span>
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
  }, [])

  // Icône SVG pour les catégories
  const getCategoryIconSVG = useCallback((iconType: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'folder': (
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      'shoe': (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l1.5-6h13.5l1.5 6m-16.5 0h16.5m-16.5 0v3.75c0 .414.336.75.75.75h15c.414 0 .75-.336.75-.75V13.5M6 10.5h12" />
        </svg>
      ),
      'shirt': (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0M4.5 9.75l3 1.5 4.5-3 4.5 3 3-1.5V21H4.5V9.75z" />
        </svg>
      ),
      'bag': (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.25 0v9.75a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V10.5h15z" />
        </svg>
      ),
      'watch': (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    
    return iconMap[iconType] || iconMap['folder']
  }, [])

  // Calcul de la pagination
  const currentPage = filters?.page || 1
  const limit = filters?.limit || 10
  const totalPages = Math.ceil(totalCount / limit)

  // Gestion de la pagination
  const handlePageChange = useCallback((page: number) => {
    if (filtersHook && filtersHook.updatePage) {
      filtersHook.updatePage(page)
    }
  }, [filtersHook])

  // Contenu de chargement
  const loadingContent = useMemo(() => (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ), [])

  // Contenu d'erreur
  if (error) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center text-red-600">
          <div className="w-12 h-12 mx-auto mb-4 text-red-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadCategories}
            className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return loadingContent
  }

  // Contenu vide
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">Aucune catégorie trouvée</p>
          <p className="text-gray-500 mt-1">
            {filters?.search ? 'Essayez de modifier vos critères de recherche' : 'Commencez par ajouter votre première catégorie'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* Actions en lot */}
      {selectedIds.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.size} catégorie(s) sélectionnée(s)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              disabled={actionLoading}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {actionLoading ? 'Suppression...' : 'Supprimer'}
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedIds.size === categories.length && categories.length > 0}
              onChange={toggleAllSelection}
              className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
            />
          </div>
          <div className="col-span-3">Catégorie</div>
          <div className="col-span-2">Parent</div>
          <div className="col-span-2">Enfants</div>
          <div className="col-span-1">Produits</div>
          <div className="col-span-1">Statut</div>
          <div className="col-span-1">Ordre</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            isSelected={selectedIds.has(category.id)}
            onToggleSelection={toggleSelection}
            onDelete={handleDelete}
            getStatusBadge={getStatusBadge}
            getCategoryIconSVG={getCategoryIconSVG}
            actionLoading={actionLoading}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            Affichage {((currentPage - 1) * limit) + 1} à {Math.min(currentPage * limit, totalCount)} sur {totalCount} catégories
          </p>
          {filters?.search && (
            <p className="text-xs text-gray-500">
              • Recherche : "{filters.search}"
            </p>
          )}
          {selectedIds.size > 0 && (
            <p className="text-xs text-blue-600">
              • {selectedIds.size} sélectionnée(s)
            </p>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Préc.
            </button>
            
            {/* Pages */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 
                ? i + 1 
                : currentPage > totalPages - 2 
                  ? totalPages - 4 + i
                  : currentPage - 2 + i
              
              if (pageNum < 1 || pageNum > totalPages) return null
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#C89B3C] text-white border-[#C89B3C]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suiv. →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant Row optimisé
const CategoryRow = memo(({ 
  category, 
  isSelected,
  onToggleSelection,
  onDelete, 
  getStatusBadge, 
  getCategoryIconSVG,
  actionLoading
}: {
  category: Category
  isSelected: boolean
  onToggleSelection: (id: string) => void
  onDelete: (id: string, name: string) => void
  getStatusBadge: (isActive: boolean) => JSX.Element
  getCategoryIconSVG: (iconType: string) => JSX.Element
  actionLoading: boolean
}) => {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Checkbox */}
        <div className="col-span-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(category.id)}
            className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
          />
        </div>

        {/* Catégorie */}
        <div className="col-span-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {getCategoryIconSVG(category.icon || 'folder')}
          </div>
          <div>
            <p className="font-medium text-gray-900">{category.name}</p>
            <p className="text-sm text-gray-500">{category.slug}</p>
          </div>
        </div>

        {/* Parent */}
        <div className="col-span-2">
          <p className="text-sm text-gray-900">
            {category.parent_name || '—'}
          </p>
        </div>

        {/* Enfants */}
        <div className="col-span-2">
          <p className="text-sm text-gray-900">{category.children?.length || 0}</p>
        </div>

        {/* Produits */}
        <div className="col-span-1">
          <p className="text-sm text-gray-900">{category.products_count || 0}</p>
        </div>

        {/* Statut */}
        <div className="col-span-1">
          {getStatusBadge(category.is_active)}
        </div>

        {/* Ordre */}
        <div className="col-span-1">
          <p className="text-sm text-gray-900">{category.display_order || '—'}</p>
        </div>

        {/* Actions */}
        <div className="col-span-1">
          <div className="flex items-center gap-1">
            <Link
              href={`/categories/modifier/${category.id}`}
              className="p-1.5 text-gray-400 hover:text-[#C89B3C] hover:bg-[#C89B3C]/10 rounded transition-all"
              title="Modifier"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => onDelete(category.id, category.name)}
              disabled={actionLoading}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all disabled:opacity-50"
              title="Supprimer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

CategoryRow.displayName = 'CategoryRow'

export default memo(CategoriesDataTableFixed)