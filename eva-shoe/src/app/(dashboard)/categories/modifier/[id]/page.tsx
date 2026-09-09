// src/app/(dashboard)/categories/modifier/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CategoryFormWithIcons from '@/components/dashboard/categories/category-form-with-icons'
import Breadcrumb, { useDashboardBreadcrumb } from '@/components/dashboard/common/breadcrumb'
import { getCategoryWithAttributes } from '@/lib/services/category-optimized.service'
import type { Category } from '@/lib/types/category.types'

export default function ModifierCategoriePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)
  const breadcrumb = useDashboardBreadcrumb()

  const categoryId = params?.id as string

  useEffect(() => {
    if (categoryId) {
      loadCategory()
    }
  }, [categoryId])

  const loadCategory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const categoryData = await getCategoryWithAttributes(categoryId)
      
      if (!categoryData) {
        setError('Catégorie introuvable')
        return
      }
      
      setCategory(categoryData)
    } catch (error) {
      console.error('Erreur lors du chargement de la catégorie:', error)
      setError('Impossible de charger la catégorie')
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = (updatedCategory: Category) => {
    router.push('/categories')
  }

  const handleCancel = () => {
    router.back()
  }

  // Préparer les breadcrumbs
  const breadcrumbItems = [
    breadcrumb.dashboard(),
    breadcrumb.categories(),
    breadcrumb.categoriesAttributes(),
    breadcrumb.categoriesEdit(category?.name)
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>

        {/* Form skeleton */}
        <div className="bg-white rounded-lg shadow animate-pulse">
          <div className="p-6 space-y-6">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Modifier la catégorie
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={loadCategory}
                className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f]"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header avec breadcrumb */}
      <div>
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Modifier "{category.name}"
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {category.hierarchy_path && `Chemin: ${category.hierarchy_path}`}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              category.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {category.is_active ? 'Active' : 'Masquée'}
            </span>
            {category.is_featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Mise en avant
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire de modification */}
      <CategoryFormWithIcons
        categoryId={categoryId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}