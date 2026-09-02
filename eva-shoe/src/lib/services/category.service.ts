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
// RÉCUPÉRER LES CATÉGORIES
// =====================================================
export async function getCategories(filters?: CategoryFilters): Promise<Category[]> {
  try {
    let query = supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(name)
      `)

    // Filtres
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    
    if (filters?.parent_id) {
      query = query.eq('parent_id', filters.parent_id)
    }
    
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }
    
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }

    // Tri
    const sortField = filters?.sort_field || 'display_order'
    const sortDirection = filters?.sort_direction || 'asc'
    query = query.order(sortField, { ascending: sortDirection === 'asc' })

    const { data, error } = await query

    if (error) throw error

    // Transformer les données pour inclure le nom du parent
    return (data || []).map(category => ({
      ...category,
      parent_name: category.parent?.name || undefined,
      products_count: 0 // TODO: Calculer le nombre de produits
    }))

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    throw new Error('Impossible de charger les catégories')
  }
}

// =====================================================
// RÉCUPÉRER UNE CATÉGORIE PAR SLUG
// =====================================================
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(name)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) throw error

    if (!data) return null

    return {
      ...data,
      parent_name: data.parent?.name || undefined,
      products_count: 0 // TODO: Calculer le nombre de produits
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
      .select(`
        *,
        parent:categories!parent_id(name)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) return null

    return {
      ...data,
      parent_name: data.parent?.name || undefined,
      products_count: 0 // TODO: Calculer le nombre de produits
    }

  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error)
    return null
  }
}

// =====================================================
// CRÉER UNE CATÉGORIE
// =====================================================
export async function createCategory(categoryData: CategoryFormData): Promise<Category> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        ...categoryData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return {
      ...data,
      products_count: 0
    }

  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    throw new Error('Impossible de créer la catégorie')
  }
}

// =====================================================
// METTRE À JOUR UNE CATÉGORIE
// =====================================================
export async function updateCategory(id: string, categoryData: Partial<CategoryFormData>): Promise<Category> {
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

    return {
      ...data,
      products_count: 0 // TODO: Calculer le nombre de produits
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error)
    throw new Error('Impossible de mettre à jour la catégorie')
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

    if (error) throw error

  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error)
    throw new Error('Impossible de supprimer la catégorie')
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

  } catch (error) {
    console.error('Erreur lors de la mise à jour en lot:', error)
    throw new Error('Impossible de mettre à jour les catégories')
  }
}

export async function bulkDeleteCategories(ids: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .in('id', ids)

    if (error) throw error

  } catch (error) {
    console.error('Erreur lors de la suppression en lot:', error)
    throw new Error('Impossible de supprimer les catégories')
  }
}

// =====================================================
// STATISTIQUES DES CATÉGORIES
// =====================================================
export async function getCategoryStats(): Promise<CategoryStats> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, is_active, is_featured')

    if (error) throw error

    const stats = (data || []).reduce((acc, category) => {
      acc.total++
      if (category.is_active) acc.active++
      if (category.is_featured) acc.featured++
      return acc
    }, {
      total: 0,
      active: 0,
      featured: 0,
      totalProducts: 0 // TODO: Calculer le nombre total de produits
    })

    return stats

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    throw new Error('Impossible de charger les statistiques des catégories')
  }
}