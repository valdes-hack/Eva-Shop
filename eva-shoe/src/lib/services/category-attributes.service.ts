// src/lib/services/category-attributes.service.ts
import { createClient } from '@/lib/supabase/client'
import type { Attribute, AttributeValue, CategoryAttribute, ProductAttributeValue } from '@/lib/types/category.types'

const supabase = createClient()

// =====================================================
// GESTION DES ATTRIBUTS
// =====================================================

export async function getAttributes(filters?: {
  type?: string
  is_active?: boolean
  search?: string
}): Promise<{ data: Attribute[], count: number }> {
  try {
    let query = supabase
      .from('attributes')
      .select(`
        *,
        values:attribute_values(*)
      `, { count: 'exact' })
      .order('display_order', { ascending: true })

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { 
      data: data || [], 
      count: count || 0 
    }
  } catch (error) {
    console.error('Erreur getAttributes:', error)
    throw new Error('Impossible de charger les attributs')
  }
}

export async function createAttribute(attributeData: {
  name: string
  slug: string
  type: string
  description?: string
  is_required?: boolean
  validation_rules?: any
  display_order?: number
}): Promise<Attribute> {
  try {
    const { data, error } = await supabase
      .from('attributes')
      .insert([attributeData])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Erreur createAttribute:', error)
    throw new Error('Impossible de créer l\'attribut')
  }
}

// =====================================================
// GESTION DES VALEURS D'ATTRIBUTS
// =====================================================

export async function getAttributeValues(attributeId: string): Promise<AttributeValue[]> {
  try {
    const { data, error } = await supabase
      .from('attribute_values')
      .select('*')
      .eq('attribute_id', attributeId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Erreur getAttributeValues:', error)
    throw new Error('Impossible de charger les valeurs d\'attribut')
  }
}

export async function createAttributeValue(valueData: {
  attribute_id: string
  value: string
  display_name: string
  color_code?: string
  display_order?: number
}): Promise<AttributeValue> {
  try {
    const { data, error } = await supabase
      .from('attribute_values')
      .insert([valueData])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Erreur createAttributeValue:', error)
    throw new Error('Impossible de créer la valeur d\'attribut')
  }
}

// =====================================================
// GESTION DES ATTRIBUTS DE CATÉGORIES
// =====================================================

export async function getCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
  try {
    const { data, error } = await supabase
      .from('category_attributes')
      .select(`
        *,
        attribute:attributes(
          *,
          values:attribute_values(*)
        )
      `)
      .eq('category_id', categoryId)
      .order('display_order', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Erreur getCategoryAttributes:', error)
    throw new Error('Impossible de charger les attributs de la catégorie')
  }
}

export async function addAttributeToCategory(data: {
  category_id: string
  attribute_id: string
  is_required?: boolean
  display_order?: number
}): Promise<CategoryAttribute> {
  try {
    const { data: result, error } = await supabase
      .from('category_attributes')
      .insert([{
        category_id: data.category_id,
        attribute_id: data.attribute_id,
        is_required: data.is_required || false,
        display_order: data.display_order || 0
      }])
      .select(`
        *,
        attribute:attributes(*)
      `)
      .single()

    if (error) throw error

    return result
  } catch (error) {
    console.error('Erreur addAttributeToCategory:', error)
    throw new Error('Impossible d\'ajouter l\'attribut à la catégorie')
  }
}

export async function removeAttributeFromCategory(categoryId: string, attributeId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('category_attributes')
      .delete()
      .eq('category_id', categoryId)
      .eq('attribute_id', attributeId)

    if (error) throw error
  } catch (error) {
    console.error('Erreur removeAttributeFromCategory:', error)
    throw new Error('Impossible de retirer l\'attribut de la catégorie')
  }
}

// =====================================================
// HÉRITAGE DES ATTRIBUTS
// =====================================================

export async function inheritParentAttributes(categoryId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('inherit_parent_attributes', {
      category_id: categoryId
    })

    if (error) throw error
  } catch (error) {
    console.error('Erreur inheritParentAttributes:', error)
    throw new Error('Impossible d\'hériter des attributs du parent')
  }
}

export async function getCategoryHierarchyWithAttributes(categoryId?: string): Promise<any[]> {
  try {
    let query = supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        parent_id,
        hierarchy_path,
        display_order,
        is_active,
        category_attributes:category_attributes(
          id,
          is_required,
          is_inherited,
          attribute:attributes(
            id,
            name,
            type
          )
        )
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (categoryId) {
      // Récupérer la catégorie et ses descendants
      query = query.or(`id.eq.${categoryId},hierarchy_path.like.%${categoryId}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Erreur getCategoryHierarchyWithAttributes:', error)
    throw new Error('Impossible de charger la hiérarchie des catégories avec attributs')
  }
}

// =====================================================
// GESTION DES VALEURS D'ATTRIBUTS PRODUITS
// =====================================================

export async function getProductAttributeValues(productId: string): Promise<ProductAttributeValue[]> {
  try {
    const { data, error } = await supabase
      .from('product_attribute_values')
      .select(`
        *,
        attribute:attributes(*),
        attribute_value:attribute_values(*)
      `)
      .eq('product_id', productId)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Erreur getProductAttributeValues:', error)
    throw new Error('Impossible de charger les valeurs d\'attributs du produit')
  }
}

export async function setProductAttributeValue(data: {
  product_id: string
  attribute_id: string
  attribute_value_id?: string
  text_value?: string
  number_value?: number
}): Promise<ProductAttributeValue> {
  try {
    const { data: result, error } = await supabase
      .from('product_attribute_values')
      .upsert([{
        product_id: data.product_id,
        attribute_id: data.attribute_id,
        attribute_value_id: data.attribute_value_id,
        text_value: data.text_value,
        number_value: data.number_value
      }])
      .select(`
        *,
        attribute:attributes(*),
        attribute_value:attribute_values(*)
      `)
      .single()

    if (error) throw error

    return result
  } catch (error) {
    console.error('Erreur setProductAttributeValue:', error)
    throw new Error('Impossible de définir la valeur d\'attribut du produit')
  }
}

// =====================================================
// STATISTIQUES DES ATTRIBUTS
// =====================================================

export async function getAttributeStats(): Promise<{
  total_attributes: number
  attributes_by_type: Record<string, number>
  categories_with_attributes: number
  products_with_attributes: number
}> {
  try {
    // Statistiques générales
    const { data: attributeStats, error: attrError } = await supabase
      .from('attributes')
      .select('type')
      .eq('is_active', true)

    if (attrError) throw attrError

    // Grouper par type
    const attributesByType = attributeStats?.reduce((acc, attr) => {
      acc[attr.type] = (acc[attr.type] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Catégories avec attributs
    const { count: categoriesWithAttributes, error: catError } = await supabase
      .from('category_attributes')
      .select('category_id', { count: 'exact', head: true })

    if (catError) throw catError

    // Produits avec attributs
    const { count: productsWithAttributes, error: prodError } = await supabase
      .from('product_attribute_values')
      .select('product_id', { count: 'exact', head: true })

    if (prodError) throw prodError

    return {
      total_attributes: attributeStats?.length || 0,
      attributes_by_type: attributesByType,
      categories_with_attributes: categoriesWithAttributes || 0,
      products_with_attributes: productsWithAttributes || 0
    }
  } catch (error) {
    console.error('Erreur getAttributeStats:', error)
    throw new Error('Impossible de charger les statistiques des attributs')
  }
}