// src/lib/hooks/use-categories.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  bulkUpdateCategories,
  bulkDeleteCategories,
  getCategoriesStats
} from '@/lib/services/category.service'
import type { 
  Category, 
  CategoryFormData, 
  CategoryFilters, 
  CategoryStats 
} from '@/lib/types/category.types'

interface UseCategoriesReturn {
  categories: Category[]
  stats: CategoryStats | null
  totalCount: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: CategoryFormData) => Promise<Category>
  update: (id: string, data: Partial<CategoryFormData>) => Promise<Category>
  remove: (id: string) => Promise<void>
  bulkUpdate: (ids: string[], updates: Partial<CategoryFormData>) => Promise<void>
  bulkDelete: (ids: string[]) => Promise<void>
}

export function useCategories(filters?: CategoryFilters): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [stats, setStats] = useState<CategoryStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [resCategories, statsData] = await Promise.all([
        getCategories(filters),
        getCategoriesStats()
      ])

      setCategories(resCategories.data)
      setTotalCount(resCategories.count)
      setStats(statsData)

    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }, [JSON.stringify(filters)])

  const create = async (data: CategoryFormData): Promise<Category> => {
    try {
      const newCategory = await createCategory(data)
      await fetchData()
      return newCategory
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(errorMessage)
      throw err
    }
  }

  const update = async (id: string, data: Partial<CategoryFormData>): Promise<Category> => {
    try {
      const updatedCategory = await updateCategory(id, data)
      await fetchData()
      return updatedCategory
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      setError(errorMessage)
      throw err
    }
  }

  const remove = async (id: string): Promise<void> => {
    try {
      await deleteCategory(id)
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      setError(errorMessage)
      throw err
    }
  }

  const bulkUpdate = async (ids: string[], updates: Partial<CategoryFormData>): Promise<void> => {
    try {
      await bulkUpdateCategories(ids, updates)
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour en lot'
      setError(errorMessage)
      throw err
    }
  }

  const bulkDelete = async (ids: string[]): Promise<void> => {
    try {
      await bulkDeleteCategories(ids)
      await fetchData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression en lot'
      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    categories,
    stats,
    totalCount,
    isLoading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
    bulkUpdate,
    bulkDelete
  }
}