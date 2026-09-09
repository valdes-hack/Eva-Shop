// src/lib/services/attribute.service.ts
import { createClient } from '@/lib/supabase/client'
import type { 
  AttributeTypeDefinition,
  CategoryAttribute,
  ProductAttribute,
  AttributeTypeFormData,
  CategoryAttributeFormData,
  ProductAttributeFormData,
  AttributeFilters,
  AttributeStats
} from '@/lib/types/attribute.types'

const supabase = createClient()

// Cache simple pour éviter les requêtes répétées
let attributeTypesCache: { data: AttributeTypeDefinition[], timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION
}

export function invalidateAttributesCache(): void {
  attributeTypesCache = null
}

// =====================================================
// GESTION DES TYPES D'ATTRIBUTS
// =====================================================

export async function getAttributeTypes(filters?: AttributeFilters): Promise<{ data: AttributeTypeDefinition[], count: number }> {
  try {
    // Utiliser le cache si pas de filtres et cache valide
    if (!filters && attributeTypesCache && isCacheValid(attributeTypesCache.timestamp)) {
      console.log('📋 Utilisation du cache pour les types d\'attributs')
      return { data: attributeTypesCache.data, count: attributeTypesCache.data.length }
    }

    console.log('🔄 Chargement des types d\'attributs depuis Supabase')

    let query = supabase
      .from('attribute_types')
      .select('*', { count: 'exact' })

    // Application des filtres
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }
    
    if (filters?.is_system !== undefined) {
      query = query.eq('is_system', filters.is_system)
    }

    // Pagination
    if (filters?.page && filters?.limit) {
      const from = (filters.page - 1) * filters.limit
      const to = from + filters.limit - 1
      query = query.range(from, to)
    }

    // Tri
    const sortField = filters?.sort_field || 'name'
    const sortDirection = filters?.sort_direction || 'asc'
    query = query.order(sortField, { ascending: sortDirection === 'asc' })

    const { data, error, count } = await query

    if (error) {
      console.error('❌ Erreur lors de la récupération des types d\'attributs:', error)
      throw error
    }

    const attributeTypes: AttributeTypeDefinition[] = data || []

    // Mise en cache si pas de filtres
    if (!filters) {
      attributeTypesCache = {
        data: attributeTypes,
        timestamp: Date.now()
      }
    }

    console.log(`✅ ${attributeTypes.length} types d'attributs chargés`)
    return { data: attributeTypes, count: count || 0 }

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des types d\'attributs:', error)
    return { data: [], count: 0 }
  }
}

export async function getAttributeType(id: string): Promise<AttributeTypeDefinition | null> {
  try {
    const { data, error } = await supabase
      .from('attribute_types')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.log('❌ Type d\'attribut non trouvé:', id)
      return null
    }

    return data as AttributeTypeDefinition

  } catch (error) {
    console.error('❌ Erreur lors de la récupération du type d\'attribut:', error)
    return null
  }
}

export async function createAttributeType(formData: AttributeTypeFormData): Promise<AttributeTypeDefinition> {
  try {
    console.log('🔄 Création du type d\'attribut:', formData.name)

    const payload = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
      is_system: false,
      is_active: formData.is_active !== false,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('attribute_types')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur lors de la création du type d\'attribut:', error)
      throw error
    }

    invalidateAttributesCache()

    console.log(`✅ Type d'attribut ${data.name} créé avec succès`)
    return data as AttributeTypeDefinition

  } catch (error: any) {
    console.error('❌ Erreur lors de la création du type d\'attribut:', error)
    throw new Error(error?.message || 'Impossible de créer le type d\'attribut')
  }
}

export async function updateAttributeType(id: string, formData: Partial<AttributeTypeFormData>): Promise<AttributeTypeDefinition> {
  try {
    console.log(`🔄 Mise à jour du type d'attribut ${id}`)

    const payload = {
      ...formData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('attribute_types')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur lors de la mise à jour du type d\'attribut:', error)
      throw error
    }

    invalidateAttributesCache()

    console.log(`✅ Type d'attribut ${data.name} mis à jour`)
    return data as AttributeTypeDefinition

  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour du type d\'attribut:', error)
    throw new Error(error?.message || 'Impossible de mettre à jour le type d\'attribut')
  }
}

export async function deleteAttributeType(id: string): Promise<void> {
  try {
    console.log(`🔄 Suppression du type d'attribut ${id}`)

    const { error } = await supabase
      .from('attribute_types')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Erreur lors de la suppression du type d\'attribut:', error)
      throw error
    }

    invalidateAttributesCache()

    console.log(`✅ Type d'attribut supprimé`)

  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression du type d\'attribut:', error)
    throw new Error(error?.message || 'Impossible de supprimer le type d\'attribut')
  }
}

// =====================================================
// GESTION DES ATTRIBUTS PAR CATÉGORIE
// =====================================================

export async function getCategoryAttributes(categoryId: string, includeInherited: boolean = true): Promise<CategoryAttribute[]> {
  try {
    console.log(`🔄 Chargement des attributs pour la catégorie ${categoryId}`)

    let query = supabase
      .from('category_attributes')
      .select(`
        *,
        attribute:attribute_types(*),
        category:categories(id, name, slug)
      `)
      .eq('category_id', categoryId)

    if (!includeInherited) {
      query = query.eq('is_inherited', false)
    }

    query = query.order('display_order', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('❌ Erreur lors de la récupération des attributs de catégorie:', error)
      throw error
    }

    console.log(`✅ ${data?.length || 0} attributs chargés pour la catégorie`)
    return (data || []) as CategoryAttribute[]

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des attributs de catégorie:', error)
    return []
  }
}

export async function assignAttributeToCategory(formData: CategoryAttributeFormData): Promise<CategoryAttribute> {
  try {
    console.log('🔄 Attribution d\'attribut à la catégorie')

    const payload = {
      ...formData,
      is_required: formData.is_required || false,
      is_filterable: formData.is_filterable !== false,
      is_visible_in_list: formData.is_visible_in_list !== false,
      display_order: formData.display_order || 0,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('category_attributes')
      .insert([payload])
      .select(`
        *,
        attribute:attribute_types(*),
        category:categories(id, name, slug)
      `)
      .single()

    if (error) {
      console.error('❌ Erreur lors de l\'attribution d\'attribut:', error)
      throw error
    }

    console.log(`✅ Attribut attribué à la catégorie`)
    return data as CategoryAttribute

  } catch (error: any) {
    console.error('❌ Erreur lors de l\'attribution d\'attribut:', error)
    throw new Error(error?.message || 'Impossible d\'attribuer l\'attribut à la catégorie')
  }
}

export async function updateCategoryAttribute(id: string, updates: Partial<CategoryAttributeFormData>): Promise<CategoryAttribute> {
  try {
    console.log(`🔄 Mise à jour de l'attribution d'attribut ${id}`)

    const payload = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('category_attributes')
      .update(payload)
      .eq('id', id)
      .select(`
        *,
        attribute:attribute_types(*),
        category:categories(id, name, slug)
      `)
      .single()

    if (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'attribution:', error)
      throw error
    }

    console.log(`✅ Attribution d'attribut mise à jour`)
    return data as CategoryAttribute

  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour de l\'attribution:', error)
    throw new Error(error?.message || 'Impossible de mettre à jour l\'attribution')
  }
}

export async function removeCategoryAttribute(id: string): Promise<void> {
  try {
    console.log(`🔄 Suppression de l'attribution d'attribut ${id}`)

    const { error } = await supabase
      .from('category_attributes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Erreur lors de la suppression de l\'attribution:', error)
      throw error
    }

    console.log(`✅ Attribution d'attribut supprimée`)

  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression de l\'attribution:', error)
    throw new Error(error?.message || 'Impossible de supprimer l\'attribution')
  }
}

// =====================================================
// GESTION DES VALEURS D'ATTRIBUTS PRODUITS
// =====================================================

export async function getProductAttributes(productId: string): Promise<ProductAttribute[]> {
  try {
    console.log(`🔄 Chargement des attributs du produit ${productId}`)

    const { data, error } = await supabase
      .from('product_attributes')
      .select(`
        *,
        attribute:attribute_types(*)
      `)
      .eq('product_id', productId)

    if (error) {
      console.error('❌ Erreur lors de la récupération des attributs produit:', error)
      throw error
    }

    console.log(`✅ ${data?.length || 0} attributs chargés pour le produit`)
    return (data || []) as ProductAttribute[]

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des attributs produit:', error)
    return []
  }
}

export async function setProductAttribute(formData: ProductAttributeFormData): Promise<ProductAttribute> {
  try {
    console.log('🔄 Définition d\'attribut produit')

    const payload = {
      ...formData,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('product_attributes')
      .upsert([payload], {
        onConflict: 'product_id,attribute_id'
      })
      .select(`
        *,
        attribute:attribute_types(*)
      `)
      .single()

    if (error) {
      console.error('❌ Erreur lors de la définition d\'attribut produit:', error)
      throw error
    }

    console.log(`✅ Attribut produit défini`)
    return data as ProductAttribute

  } catch (error: any) {
    console.error('❌ Erreur lors de la définition d\'attribut produit:', error)
    throw new Error(error?.message || 'Impossible de définir l\'attribut produit')
  }
}

export async function removeProductAttribute(productId: string, attributeId: string): Promise<void> {
  try {
    console.log(`🔄 Suppression d'attribut produit`)

    const { error } = await supabase
      .from('product_attributes')
      .delete()
      .eq('product_id', productId)
      .eq('attribute_id', attributeId)

    if (error) {
      console.error('❌ Erreur lors de la suppression d\'attribut produit:', error)
      throw error
    }

    console.log(`✅ Attribut produit supprimé`)

  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression d\'attribut produit:', error)
    throw new Error(error?.message || 'Impossible de supprimer l\'attribut produit')
  }
}

// =====================================================
// STATISTIQUES ET UTILITAIRES
// =====================================================

export async function getAttributeStats(): Promise<AttributeStats> {
  try {
    console.log('🔄 Calcul des statistiques des attributs')

    // Compter les types d'attributs par type
    const { data: typeStats, error: typeError } = await supabase
      .from('attribute_types')
      .select('type')
      .eq('is_active', true)

    if (typeError) throw typeError

    // Compter les utilisations les plus fréquentes
    const { data: usageStats, error: usageError } = await supabase
      .from('category_attributes')
      .select(`
        attribute_id,
        attribute:attribute_types(name)
      `)

    if (usageError) throw usageError

    // Compter les catégories avec attributs
    const { data: categoryStats, error: categoryError } = await supabase
      .from('category_attributes')
      .select('category_id', { count: 'exact' })

    if (categoryError) throw categoryError

    // Traitement des données
    const byType: Record<string, number> = {}
    typeStats?.forEach(item => {
      byType[item.type] = (byType[item.type] || 0) + 1
    })

    const usageCounts: Record<string, { name: string, count: number }> = {}
    usageStats?.forEach(item => {
      const id = item.attribute_id
      const name = item.attribute?.name || 'Inconnu'
      if (!usageCounts[id]) {
        usageCounts[id] = { name, count: 0 }
      }
      usageCounts[id].count++
    })

    const mostUsed = Object.entries(usageCounts)
      .map(([id, data]) => ({ id, name: data.name, usage_count: data.count }))
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 10)

    const uniqueCategories = new Set(usageStats?.map(item => item.category_id))

    const stats: AttributeStats = {
      total_types: typeStats?.length || 0,
      by_type: byType as any,
      most_used: mostUsed,
      categories_with_attributes: uniqueCategories.size
    }

    console.log('✅ Statistiques calculées:', stats)
    return stats

  } catch (error) {
    console.error('❌ Erreur lors du calcul des statistiques:', error)
    return {
      total_types: 0,
      by_type: {} as any,
      most_used: [],
      categories_with_attributes: 0
    }
  }
}