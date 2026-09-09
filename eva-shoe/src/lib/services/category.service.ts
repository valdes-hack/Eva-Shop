// src/lib/services/category.service.ts
import { createClient } from '@/lib/supabase/client'
import type { 
  Category, 
  CategoryFormData, 
  CategoryFilters, 
  CategoryStats 
} from '@/lib/types/category.types'

const supabase = createClient()

// =====================================================
// RÉCUPÉRER LES CATÉGORIES (Requête directe & résiliente)
// =====================================================
export async function getCategories(filters?: CategoryFilters): Promise<{ data: Category[], count: number }> {
  try {
    // 1. Requête principale simple sans jointures complexes (100% robuste sur Supabase)
    let query = supabase
      .from('categories')
      .select('*', { count: 'exact' })

    // Application des filtres
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    
    if (filters?.parent_id) {
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

    // Tri par ordre d'affichage
    const sortField = (filters?.sort_field as string) || 'display_order'
    const sortDirection = filters?.sort_direction || 'asc'
    query = query.order(sortField, { ascending: sortDirection === 'asc' })

    const { data, error, count } = await query

    if (error) {
      console.error('Erreur Supabase getCategories:', error)
      throw error
    }

    const rawCategories = data || []

    // 2. Extraire les parent_id uniques et charger leurs noms en mémoire
    const parentIds = Array.from(new Set(rawCategories.map((c: any) => c.parent_id).filter(Boolean)))
    let parentMap: Record<string, string> = {}
    
    if (parentIds.length > 0) {
      const { data: parents } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', parentIds)

      if (parents) {
        parentMap = parents.reduce((acc: Record<string, string>, p: any) => {
          acc[p.id] = p.name
          return acc
        }, {})
      }
    }

    // 3. Mapper les objets Category avec leur parent_name
    const transformedData: Category[] = rawCategories.map((cat: any) => ({
      ...cat,
      parent_name: cat.parent_id ? parentMap[cat.parent_id] : undefined,
      children: [],
      products: [],
      products_count: 0
    }))

    return { data: transformedData, count: count || 0 }

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return { data: [], count: 0 }
  }
}

// =====================================================
// RÉCUPÉRER UNE CATÉGORIE PAR SLUG
// =====================================================
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) return null

    let parent_name: string | undefined = undefined
    if (data.parent_id) {
      const { data: pData } = await supabase
        .from('categories')
        .select('name')
        .eq('id', data.parent_id)
        .single()
      if (pData) parent_name = pData.name
    }

    return {
      ...data,
      parent_name,
      children: [],
      products: [],
      products_count: 0
    }

  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie par slug:', error)
    return null
  }
}

// =====================================================
// RÉCUPÉRER UNE CATÉGORIE
// =====================================================
export async function getCategory(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null

    let parent_name: string | undefined = undefined
    if (data.parent_id) {
      const { data: pData } = await supabase
        .from('categories')
        .select('name')
        .eq('id', data.parent_id)
        .single()
      if (pData) parent_name = pData.name
    }

    return {
      ...data,
      parent_name,
      children: [],
      products: [],
      products_count: 0
    }

  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error)
    return null
  }
}

// =====================================================
// CRÉER UNE CATÉGORIE
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
    const payload = {
      name: categoryData.name,
      slug: categoryData.slug,
      parent_id: categoryData.parent_id || null,
      description: categoryData.description || null,
      image_url: categoryData.image_url || null,
      icon: categoryData.icon || null,
      display_order: categoryData.display_order ?? 0,
      is_featured: categoryData.is_featured ?? false,
      is_active: categoryData.is_active !== false,
      meta_title: categoryData.meta_title || null,
      meta_description: categoryData.meta_description || null,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase createCategory:', error)
      throw error
    }

    return {
      ...data,
      children: [],
      products: [],
      products_count: 0
    }

  } catch (error: any) {
    console.error('Erreur lors de la création de la catégorie:', error)
    throw new Error(error?.message || 'Impossible de créer la catégorie')
  }
}

// =====================================================
// METTRE À JOUR UNE CATÉGORIE
// =====================================================
export async function updateCategory(id: string, categoryData: Partial<CategoryFormData>): Promise<Category> {
  try {
    const payload = {
      ...categoryData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase updateCategory:', error)
      throw error
    }

    return {
      ...data,
      children: [],
      products: [],
      products_count: 0
    }

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error)
    throw new Error(error?.message || 'Impossible de mettre à jour la catégorie')
  }
}

// =====================================================
// SUPPRIMER UNE CATÉGORIE
// =====================================================
export async function deleteCategory(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur Supabase deleteCategory:', error)
      throw error
    }

  } catch (error: any) {
    console.error('Erreur lors de la suppression de la catégorie:', error)
    throw new Error(error?.message || 'Impossible de supprimer la catégorie')
  }
}

// =====================================================
// ACTIONS EN LOT
// =====================================================
export async function bulkUpdateCategories(
  ids: string[], 
  updates: Partial<CategoryFormData>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .in('id', ids)

    if (error) throw error

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour en lot:', error)
    throw new Error(error?.message || 'Impossible de mettre à jour les catégories')
  }
}

export async function bulkDeleteCategories(ids: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .in('id', ids)

    if (error) throw error

  } catch (error: any) {
    console.error('Erreur lors de la suppression en lot:', error)
    throw new Error(error?.message || 'Impossible de supprimer les catégories')
  }
}

// =====================================================
// STATISTIQUES DES CATÉGORIES
// =====================================================
export async function getCategoriesStats(): Promise<CategoryStats> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, is_active, is_featured, parent_id')

    if (error) throw error

    const stats = (data || []).reduce((acc, category) => {
      acc.total++
      if (category.is_active) {
        acc.active++
      } else {
        acc.hidden++
      }
      if (category.parent_id) {
        acc.subcategories++
      }
      return acc
    }, {
      total: 0,
      active: 0,
      hidden: 0,
      subcategories: 0
    })

    return stats

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return {
      total: 0,
      active: 0,
      hidden: 0,
      subcategories: 0
    }
  }
}