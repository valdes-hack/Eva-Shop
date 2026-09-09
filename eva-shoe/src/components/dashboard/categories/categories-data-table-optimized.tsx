// src/components/dashboard/categories/categories-data-table-optimized.tsx
'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import Link from 'next/link'
import { getCategories, updateCategory } from '@/lib/services/category-optimized.service'
import type { Category } from '@/lib/types/category.types'

interface CategoriesDataTableProps {
  refreshTrigger?: number
  filters?: any
  filtersHook?: any
  onRefresh?: () => void
}

function CategoriesDataTable({ refreshTrigger, filters, filtersHook, onRefresh }: CategoriesDataTableProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Utilisation de useCallback pour éviter les re-rendus
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading categories with filters:', filters)
      
      const { data, count } = await getCategories(filters)
      
      setCategories(data)
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Erreur loadCategories:', error)
      setError('Impossible de charger les catégories')
      setCategories([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadCategories()
  }, [loadCategories, refreshTrigger])

  // Fonction pour supprimer une catégorie
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return
    
    try {
      // Nous utiliserons is_active = false au lieu de supprimer
      await updateCategory(id, { is_active: false })
      
      // Refresh les données
      if (onRefresh) {
        onRefresh()
      } else {
        loadCategories()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Impossible de supprimer la catégorie')
    }
  }, [loadCategories, onRefresh])

  // Memoisation des fonctions pour éviter les re-rendus
  const getStatusBadge = useCallback((isActive: boolean) => {
    if (!isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Masquée</span>
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
  }, [])

  const getCategoryIcon = useCallback((name: string) => {
    const iconMap: { [key: string]: string } = {
      'chaussures': '👟',
      'vêtements': '👕',
      'accessoires': '👜',
      'sneakers': '👟',
      'baskets': '👟',
      'sandales': '👡',
      'montres': '⌚',
      'ceintures': '👔'
    }
    return iconMap[name.toLowerCase()] || '📁'
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

  // Memoisation du contenu de loading
  const loadingContent = useMemo(() => (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
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
          <p>{error}</p>
          <button 
            onClick={loadCategories}
            className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
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
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-1"></div>
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
            getStatusBadge={getStatusBadge}
            getCategoryIcon={getCategoryIcon}
            onDelete={handleDelete}
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
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            
            {/* Affichage intelligent des pages */}
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
                  className={`px-3 py-1 text-sm border rounded ${
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
              →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant Row séparé et mémorisé
const CategoryRow = memo(({ category, getStatusBadge, getCategoryIcon, onDelete }: {
  category: Category
  getStatusBadge: (isActive: boolean) => JSX.Element
  getCategoryIcon: (name: string) => string
  onDelete: (id: string) => void
}) => {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Drag Handle */}
        <div className="col-span-1">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        {/* Catégorie */}
        <div className="col-span-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
            {getCategoryIcon(category.name)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{category.name}</p>
            <p className="text-sm text-gray-500">{category.slug}</p>
          </div>
        </div>

        {/* Parent */}
        <div className="col-span-2">
          <p className="text-sm text-gray-900">
            {category.parent_id ? 'Sous-catégorie' : '—'}
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
          <div className="flex items-center gap-2">
            <Link
              href={`/categories/modifier/${category.id}`}
              className="p-1 text-gray-400 hover:text-[#C89B3C] transition-colors"
              title="Modifier"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => onDelete(category.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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

export default memo(CategoriesDataTable)