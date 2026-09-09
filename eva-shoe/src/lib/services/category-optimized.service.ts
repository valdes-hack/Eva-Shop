// src/lib/services/category-optimized.service.ts
import { createClient } from '@/lib/supabase/client'
import type { 
  Category, 
  CategoryFormData, 
  CategoryFilters, 
  CategoryStats 
} from '@/lib/types/category.types'

const supabase = createClient()

// Cache simple en mémoire pour éviter les requêtes répétées
let categoriesCache: { data: Category[], timestamp: number } | null = null
let hierarchyCache: { data: Category[], timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// =====================================================
// GESTION DU CACHE
// =====================================================
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION
}

export function invalidateCategoriesCache(): void {
  categoriesCache = null
  hierarchyCache = null
}

// =====================================================
// RÉCUPÉRER LES CATÉGORIES (Optimisé avec cache)
// =====================================================
export async function getCategories(filters?: CategoryFilters): Promise<{ data: Category[], count: number }> {
  try {
    // Si pas de filtres et cache valide, utiliser le cache
    if (!filters && categoriesCache && isCacheValid(categoriesCache.timestamp)) {
      console.log('📋 Utilisation du cache pour les catégories')
      return { data: categoriesCache.data, count: categoriesCache.data.length }
    }

    console.log('🔄 Chargement des catégories depuis Supabase avec filtres:', filters)

    // 1. Requête principale
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

    // Tri
    const sortField = (filters?.sort_field as string) || 'display_order'
    const sortDirection = filters?.sort_direction || 'asc'
    query = query.order(sortField, { ascending: sortDirection === 'asc' })

    const { data, error, count } = await query

    if (error) {
      console.error('❌ Erreur Supabase getCategories:', error)
      throw error
    }

    const rawCategories = data || []

    // 2. Récupérer les noms des parents en une seule requête
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

    // 3. Mapper les objets Category
    const transformedData: Category[] = rawCategories.map((cat: any) => ({
      ...cat,
      parent_name: cat.parent_id ? parentMap[cat.parent_id] : undefined,
      children: [],
      products: [],
      products_count: 0
    }))

    // 4. Mise en cache si pas de filtres
    if (!filters) {
      categoriesCache = {
        data: transformedData,
        timestamp: Date.now()
      }
    }

    console.log(`✅ ${transformedData.length} catégories chargées`)
    return { data: transformedData, count: count || 0 }

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des catégories:', error)
    return { data: [], count: 0 }
  }
}

// =====================================================
// RÉCUPÉRER LA HIÉRARCHIE (pour les selects)
// =====================================================
export async function getCategoryHierarchy(): Promise<Category[]> {
  try {
    // Utiliser le cache si valide
    if (hierarchyCache && isCacheValid(hierarchyCache.timestamp)) {
      console.log('📋 Utilisation du cache pour la hiérarchie')
      return hierarchyCache.data
    }

    console.log('🔄 Chargement de la hiérarchie depuis Supabase')

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) throw error

    const categories: Category[] = (data || []).map(cat => ({
      ...cat,
      children: [],
      products: [],
      products_count: 0
    }))

    // Construire la hiérarchie
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]))
    const rootCategories: Category[] = []

    categories.forEach(category => {
      if (category.parent_id && categoryMap.has(category.parent_id)) {
        const parent = categoryMap.get(category.parent_id)!
        parent.children = parent.children || []
        parent.children.push(category)
      } else {
        rootCategories.push(category)
      }
    })

    // Mise en cache
    hierarchyCache = {
      data: rootCategories,
      timestamp: Date.now()
    }

    console.log(`✅ Hiérarchie construite avec ${rootCategories.length} catégories racines`)
    return rootCategories

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la hiérarchie:', error)
    return []
  }
}

// =====================================================
// RÉCUPÉRER UNE CATÉGORIE AVEC SES ATTRIBUTS
// =====================================================
export async function getCategoryWithAttributes(id: string): Promise<Category | null> {
  try {
    console.log(`🔄 Chargement de la catégorie ${id} avec attributs`)

    // 1. Récupérer la catégorie
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (categoryError || !categoryData) {
      console.log('❌ Catégorie non trouvée:', id)
      return null
    }

    // 2. Récupérer le nom du parent si existe
    let parent_name: string | undefined = undefined
    if (categoryData.parent_id) {
      const { data: parentData } = await supabase
        .from('categories')
        .select('name')
        .eq('id', categoryData.parent_id)
        .single()
      if (parentData) parent_name = parentData.name
    }

    // 3. Récupérer les attributs (si la table existe)
    let attributes: any[] = []
    try {
      const { data: attributesData } = await supabase
        .from('category_attributes')
        .select(`
          *,
          attribute:attribute_types(*)
        `)
        .eq('category_id', id)
      
      attributes = attributesData || []
    } catch (error) {
      console.log('ℹ️ Table category_attributes non disponible, ignoré')
    }

    const result: Category = {
      ...categoryData,
      parent_name,
      children: [],
      products: [],
      products_count: 0,
      attributes
    }

    console.log(`✅ Catégorie ${categoryData.name} chargée avec ${attributes.length} attributs`)
    return result

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la catégorie:', error)
    return null
  }
}

// =====================================================
// CRÉER UNE CATÉGORIE
// =====================================================
export async function createCategory(categoryData: CategoryFormData): Promise<Category> {
  try {
    console.log('🔄 Création de la catégorie:', categoryData.name)

    const payload = {
      name: categoryData.name,
      slug: categoryData.slug,
      parent_id: categoryData.parent_id || null,
      description: categoryData.description || null,
      image_url: categoryData.image_url || null,
      banner_image_url: categoryData.banner_image_url || null,
      icon: categoryData.icon || 'folder',
      display_order: categoryData.display_order ?? 0,
      is_featured: categoryData.is_featured ?? false,
      is_active: categoryData.is_active !== false,
      meta_title: categoryData.meta_title || null,
      meta_description: categoryData.meta_description || null,
      presentation_text: categoryData.presentation_text || null,
      seo_keywords: categoryData.seo_keywords || null,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur Supabase createCategory:', error)
      throw error
    }

    // Invalider le cache
    invalidateCategoriesCache()

    const result: Category = {
      ...data,
      children: [],
      products: [],
      products_count: 0
    }

    console.log(`✅ Catégorie ${result.name} créée avec succès`)
    return result

  } catch (error: any) {
    console.error('❌ Erreur lors de la création de la catégorie:', error)
    throw new Error(error?.message || 'Impossible de créer la catégorie')
  }
}

// =====================================================
// METTRE À JOUR UNE CATÉGORIE
// =====================================================
export async function updateCategory(id: string, categoryData: Partial<CategoryFormData>): Promise<Category> {
  try {
    console.log(`🔄 Mise à jour de la catégorie ${id}:`, Object.keys(categoryData))

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
      console.error('❌ Erreur Supabase updateCategory:', error)
      throw error
    }

    // Invalider le cache
    invalidateCategoriesCache()

    const result: Category = {
      ...data,
      children: [],
      products: [],
      products_count: 0
    }

    console.log(`✅ Catégorie ${result.name} mise à jour avec succès`)
    return result

  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour de la catégorie:', error)
    throw new Error(error?.message || 'Impossible de mettre à jour la catégorie')
  }
}

// =====================================================
// SUPPRIMER UNE CATÉGORIE (soft delete)
// =====================================================
export async function deleteCategory(id: string): Promise<void> {
  try {
    console.log(`🔄 Suppression (désactivation) de la catégorie ${id}`)

    // Soft delete: marquer comme inactive au lieu de supprimer
    const { error } = await supabase
      .from('categories')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('❌ Erreur Supabase deleteCategory:', error)
      throw error
    }

    // Invalider le cache
    invalidateCategoriesCache()

    console.log(`✅ Catégorie ${id} désactivée avec succès`)

  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression de la catégorie:', error)
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
    console.log(`🔄 Mise à jour en lot de ${ids.length} catégories`)

    const { error } = await supabase
      .from('categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .in('id', ids)

    if (error) throw error

    // Invalider le cache
    invalidateCategoriesCache()

    console.log(`✅ ${ids.length} catégories mises à jour en lot`)

  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour en lot:', error)
    throw new Error(error?.message || 'Impossible de mettre à jour les catégories')
  }
}

export async function bulkDeleteCategories(ids: string[]): Promise<void> {
  try {
    console.log(`🔄 Suppression en lot de ${ids.length} catégories`)

    // Soft delete en lot
    const { error } = await supabase
      .from('categories')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .in('id', ids)

    if (error) throw error

    // Invalider le cache
    invalidateCategoriesCache()

    console.log(`✅ ${ids.length} catégories supprimées en lot`)

  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression en lot:', error)
    throw new Error(error?.message || 'Impossible de supprimer les catégories')
  }
}

// =====================================================
// STATISTIQUES DES CATÉGORIES
// =====================================================
export async function getCategoriesStats(): Promise<CategoryStats> {
  try {
    console.log('🔄 Chargement des statistiques des catégories')

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

    console.log('✅ Statistiques calculées:', stats)
    return stats

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error)
    return {
      total: 0,
      active: 0,
      hidden: 0,
      subcategories: 0
    }
  }
}