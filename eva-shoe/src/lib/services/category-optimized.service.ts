// src/lib/services/category-optimized.service.ts
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types/category.types'

// Client unique réutilisé
const supabase = createClient()

// Cache en mémoire pour éviter les requêtes répétées
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 30000 // 30 secondes

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

// =====================================================
// RÉCUPÉRER LES CATÉGORIES (OPTIMISÉ)
// =====================================================
export async function getCategories(filters?: { 
  search?: string
  parent_id?: string | null
  is_active?: boolean
  is_featured?: boolean
  sort_field?: string
  sort_direction?: 'asc' | 'desc'
  page?: number
  limit?: number
  parentOnly?: boolean
}): Promise<{ data: Category[], count: number }> {
  try {
    // Clé de cache basée sur les filtres
    const cacheKey = `categories_${JSON.stringify(filters || {})}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    // UNE SEULE REQUÊTE optimisée
    let query = supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        parent_id,
        image_url,
        icon,
        display_order,
        is_featured,
        is_active,
        meta_title,
        meta_description,
        created_at,
        updated_at
      `, { count: 'exact' })

    // Filtres optimisés
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`)
    }
    
    if (filters?.parent_id === 'not_null') {
      query = query.not('parent_id', 'is', null)
    } else if (filters?.parent_id) {
      query = query.eq('parent_id', filters.parent_id)
    }
    
    if (filters?.parentOnly) {
      query = query.is('parent_id', null)
    }
    
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }
    
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }

    // Pagination
    if (filters?.page && filters?.limit) {
      const from = (filters.page - 1) * filters.limit
      const to = from + filters.limit - 1
      query = query.range(from, to)
    }

    // Tri optimisé
    const sortField = filters?.sort_field || 'display_order'
    const sortDirection = filters?.sort_direction || 'asc'
    query = query.order(sortField, { ascending: sortDirection === 'asc' })

    const { data, error, count } = await query

    if (error) throw error

    // Transformation ultra-rapide
    const transformedData = (data || []).map(category => ({
      ...category,
      children: [],
      products: [],
      products_count: 0
    }))

    const result = { data: transformedData, count: count || 0 }
    
    // Mise en cache
    setCachedData(cacheKey, result)
    
    return result

  } catch (error) {
    console.error('Erreur getCategories:', error)
    throw new Error('Impossible de charger les catégories')
  }
}

// =====================================================
// CRÉER UNE CATÉGORIE (OPTIMISÉ)
// =====================================================
export async function createCategory(categoryData: {
  name: string
  slug: string
  parent_id?: string | null
  description?: string | null
  image_url?: string | null
  icon?: string | null
  display_order?: number
  is_featured?: boolean
  is_active?: boolean
  meta_title?: string | null
  meta_description?: string | null
}): Promise<Category> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: categoryData.name,
        slug: categoryData.slug,
        parent_id: categoryData.parent_id,
        description: categoryData.description,
        image_url: categoryData.image_url,
        icon: categoryData.icon,
        display_order: categoryData.display_order || 0,
        is_featured: categoryData.is_featured || false,
        is_active: categoryData.is_active !== false,
        meta_title: categoryData.meta_title,
        meta_description: categoryData.meta_description
      }])
      .select()
      .single()

    if (error) throw error

    // Invalider le cache
    cache.clear()

    return {
      ...data,
      children: [],
      products: [],
      products_count: 0
    }

  } catch (error) {
    console.error('Erreur createCategory:', error)
    throw new Error('Impossible de créer la catégorie')
  }
}

// =====================================================
// RÉCUPÉRER UNE CATÉGORIE PAR ID (OPTIMISÉ)
// =====================================================
export async function getCategory(id: string): Promise<Category | null> {
  try {
    const cacheKey = `category_${id}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    const result = {
      ...data,
      children: [],
      products: [],
      products_count: 0
    }

    setCachedData(cacheKey, result)
    return result

  } catch (error) {
    console.error('Erreur getCategory:', error)
    return null
  }
}

// =====================================================
// METTRE À JOUR UNE CATÉGORIE (OPTIMISÉ)
// =====================================================
export async function updateCategory(id: string, categoryData: any): Promise<Category> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...categoryData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Invalider le cache
    cache.clear()

    return {
      ...data,
      children: [],
      products: [],
      products_count: 0
    }

  } catch (error) {
    console.error('Erreur updateCategory:', error)
    throw new Error('Impossible de mettre à jour la catégorie')
  }
}

// =====================================================
// STATISTIQUES DES CATÉGORIES (OPTIMISÉ)
// =====================================================
export async function getCategoriesStats() {
  try {
    const cacheKey = 'categories_stats'
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    const { data, error } = await supabase
      .from('categories')
      .select('is_active, parent_id')

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      active: data?.filter(c => c.is_active).length || 0,
      hidden: data?.filter(c => !c.is_active).length || 0,
      subcategories: data?.filter(c => c.parent_id).length || 0
    }

    setCachedData(cacheKey, stats)
    return stats

  } catch (error) {
    console.error('Erreur getCategoriesStats:', error)
    throw new Error('Impossible de charger les statistiques des catégories')
  }
}