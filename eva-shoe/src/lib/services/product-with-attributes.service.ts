// src/lib/services/product-with-attributes.service.ts
import { createClient } from '@/lib/supabase/client'
import { getCategoryAttributes } from './attribute.service'
import type { 
  Product,
  ProductWithAttributes,
  ProductFormData,
  ProductFilters,
  ProductStats
} from '@/lib/types/product-enhanced.types'
import type { ProductAttribute } from '@/lib/types/attribute.types'

const supabase = createClient()

// Cache pour éviter les requêtes répétées
let productsCache: { data: ProductWithAttributes[], timestamp: number } | null = null
const CACHE_DURATION = 3 * 60 * 1000 // 3 minutes

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION
}

export function invalidateProductsCache(): void {
  productsCache = null
}

// =====================================================
// RÉCUPÉRER TOUS LES PRODUITS AVEC ATTRIBUTS
// =====================================================

export async function getProductsWithAttributes(filters?: ProductFilters): Promise<{ 
  data: ProductWithAttributes[], 
  count: number 
}> {
  try {
    console.log('🔄 Chargement des produits avec attributs')

    // Utiliser le cache si pas de filtres
    if (!filters && productsCache && isCacheValid(productsCache.timestamp)) {
      console.log('📋 Utilisation du cache pour les produits')
      return { data: productsCache.data, count: productsCache.data.length }
    }

    let query = supabase
      .from('products_with_attributes')
      .select('*', { count: 'exact' })

    // Application des filtres
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`)
    }
    
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }
    
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }
    
    if (filters?.price_min) {
      query = query.gte('price', filters.price_min)
    }
    
    if (filters?.price_max) {
      query = query.lte('price', filters.price_max)
    }

    // Filtres par attributs
    if (filters?.attributes && Object.keys(filters.attributes).length > 0) {
      // Cette partie sera implémentée selon les besoins spécifiques
      // Pour l'instant, on fait un filtrage côté client
    }

    // Pagination
    if (filters?.page && filters?.limit) {
      const from = (filters.page - 1) * filters.limit
      const to = from + filters.limit - 1
      query = query.range(from, to)
    }

    // Tri
    const sortField = filters?.sort_field || 'created_at'
    const sortDirection = filters?.sort_direction || 'desc'
    query = query.order(sortField, { ascending: sortDirection === 'asc' })

    const { data, error, count } = await query

    if (error) {
      console.error('❌ Erreur lors de la récupération des produits:', error)
      throw error
    }

    const products: ProductWithAttributes[] = data?.map(item => ({
      ...item,
      attributes: item.attributes || [],
      images: item.images || []
    })) || []

    // Filtrage côté client pour les attributs (temporaire)
    let filteredProducts = products
    if (filters?.attributes) {
      filteredProducts = products.filter(product => {
        return Object.entries(filters.attributes!).every(([attributeSlug, value]) => {
          const productAttr = product.attributes.find(attr => attr.attribute_slug === attributeSlug)
          if (!productAttr) return false
          
          const productValue = productAttr.text_value || productAttr.display_value || ''
          return productValue.toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    // Mise en cache si pas de filtres
    if (!filters) {
      productsCache = {
        data: filteredProducts,
        timestamp: Date.now()
      }
    }

    console.log(`✅ ${filteredProducts.length} produits chargés`)
    return { data: filteredProducts, count: count || 0 }

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des produits:', error)
    return { data: [], count: 0 }
  }
}

// =====================================================
// RÉCUPÉRER UN PRODUIT PAR ID AVEC ATTRIBUTS
// =====================================================

export async function getProductWithAttributes(id: string): Promise<ProductWithAttributes | null> {
  try {
    console.log(`🔄 Chargement du produit ${id} avec attributs`)

    const { data, error } = await supabase
      .from('products_with_attributes')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.log('❌ Produit non trouvé:', id)
      return null
    }

    const product: ProductWithAttributes = {
      ...data,
      attributes: data.attributes || [],
      images: data.images || []
    }

    console.log(`✅ Produit ${product.name} chargé`)
    return product

  } catch (error) {
    console.error('❌ Erreur lors de la récupération du produit:', error)
    return null
  }
}

// =====================================================
// CRÉER UN PRODUIT AVEC ATTRIBUTS
// =====================================================

export async function createProductWithAttributes(
  formData: ProductFormData,
  attributeValues: Record<string, any>
): Promise<ProductWithAttributes> {
  try {
    console.log('🔄 Création du produit avec attributs:', formData.name)

    // 1. Créer le produit
    const productPayload = {
      name: formData.name,
      slug: formData.slug,
      sku: formData.sku,
      description: formData.description,
      short_description: formData.short_description,
      price: formData.price,
      sale_price: formData.sale_price,
      category_id: formData.category_id,
      stock_quantity: formData.stock_quantity || 0,
      reserved_quantity: 0,
      security_stock: formData.security_stock || 5,
      status: formData.status || 'draft',
      tags: formData.tags || [],
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      is_featured: formData.is_featured || false,
      is_active: formData.is_active !== false,
      weight: formData.weight,
      dimensions: formData.dimensions,
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([productPayload])
      .select()
      .single()

    if (productError) {
      console.error('❌ Erreur lors de la création du produit:', productError)
      throw productError
    }

    // 2. Ajouter les attributs si fournis
    if (attributeValues && Object.keys(attributeValues).length > 0) {
      await setProductAttributes(product.id, attributeValues)
    }

    // 3. Ajouter les images si fournies
    if (formData.images && formData.images.length > 0) {
      await setProductImages(product.id, formData.images)
    }

    invalidateProductsCache()

    // 4. Récupérer le produit complet avec attributs
    const fullProduct = await getProductWithAttributes(product.id)
    if (!fullProduct) {
      throw new Error('Impossible de récupérer le produit créé')
    }

    console.log(`✅ Produit ${product.name} créé avec succès`)
    return fullProduct

  } catch (error: any) {
    console.error('❌ Erreur lors de la création du produit:', error)
    throw new Error(error?.message || 'Impossible de créer le produit')
  }
}

// =====================================================
// METTRE À JOUR UN PRODUIT AVEC ATTRIBUTS
// =====================================================

export async function updateProductWithAttributes(
  id: string,
  formData: Partial<ProductFormData>,
  attributeValues?: Record<string, any>
): Promise<ProductWithAttributes> {
  try {
    console.log(`🔄 Mise à jour du produit ${id}`)

    // 1. Mettre à jour le produit
    if (Object.keys(formData).length > 0) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .update(formData)
        .eq('id', id)
        .select()
        .single()

      if (productError) {
        console.error('❌ Erreur lors de la mise à jour du produit:', productError)
        throw productError
      }
    }

    // 2. Mettre à jour les attributs si fournis
    if (attributeValues && Object.keys(attributeValues).length > 0) {
      await setProductAttributes(id, attributeValues)
    }

    // 3. Mettre à jour les images si fournies
    if (formData.images) {
      await setProductImages(id, formData.images)
    }

    invalidateProductsCache()

    // 4. Récupérer le produit mis à jour
    const updatedProduct = await getProductWithAttributes(id)
    if (!updatedProduct) {
      throw new Error('Impossible de récupérer le produit mis à jour')
    }

    console.log(`✅ Produit mis à jour`)
    return updatedProduct

  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour du produit:', error)
    throw new Error(error?.message || 'Impossible de mettre à jour le produit')
  }
}
// =====================================================
// GESTION DES ATTRIBUTS DE PRODUIT
// =====================================================

export async function setProductAttributes(
  productId: string, 
  attributeValues: Record<string, any>
): Promise<void> {
  try {
    console.log(`🔄 Configuration des attributs pour le produit ${productId}`)

    const attributeEntries = Object.entries(attributeValues)
    if (attributeEntries.length === 0) return

    // Récupérer les IDs des attributs par leur slug
    const attributeSlugs = attributeEntries.map(([slug]) => slug)
    const { data: attributeTypes, error: attrError } = await supabase
      .from('attribute_types')
      .select('id, slug, type')
      .in('slug', attributeSlugs)

    if (attrError) {
      console.error('❌ Erreur lors de la récupération des types d\'attributs:', attrError)
      throw attrError
    }

    // Préparer les données d'attributs
    const attributePayloads = attributeEntries.map(([slug, value]) => {
      const attributeType = attributeTypes?.find(at => at.slug === slug)
      if (!attributeType) {
        console.warn(`⚠️ Type d'attribut non trouvé pour le slug: ${slug}`)
        return null
      }

      const payload: any = {
        product_id: productId,
        attribute_id: attributeType.id,
        is_inherited: false
      }

      // Déterminer le type de valeur selon le type d'attribut
      switch (attributeType.type) {
        case 'number':
          payload.number_value = parseFloat(value) || null
          payload.display_value = value?.toString()
          break
        case 'select':
        case 'color':
        case 'text':
        default:
          payload.text_value = value?.toString() || null
          payload.display_value = value?.toString()
          break
      }

      return payload
    }).filter(Boolean)

    // Supprimer les anciens attributs du produit
    const { error: deleteError } = await supabase
      .from('product_attributes')
      .delete()
      .eq('product_id', productId)

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression des anciens attributs:', deleteError)
      throw deleteError
    }

    // Insérer les nouveaux attributs
    if (attributePayloads.length > 0) {
      const { error: insertError } = await supabase
        .from('product_attributes')
        .insert(attributePayloads)

      if (insertError) {
        console.error('❌ Erreur lors de l\'insertion des attributs:', insertError)
        throw insertError
      }
    }

    console.log(`✅ ${attributePayloads.length} attributs configurés`)

  } catch (error) {
    console.error('❌ Erreur lors de la configuration des attributs:', error)
    throw error
  }
}

export async function getProductAttributes(productId: string): Promise<ProductAttribute[]> {
  try {
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

    return data || []
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des attributs produit:', error)
    return []
  }
}

// =====================================================
// GESTION DES IMAGES DE PRODUIT
// =====================================================

export async function setProductImages(
  productId: string,
  images: Array<{ url: string; alt_text?: string; is_primary?: boolean }>
): Promise<void> {
  try {
    console.log(`🔄 Configuration des images pour le produit ${productId}`)

    // Supprimer les anciennes images
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId)

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression des anciennes images:', deleteError)
      throw deleteError
    }

    // Insérer les nouvelles images
    if (images.length > 0) {
      const imagePayloads = images.map((image, index) => ({
        product_id: productId,
        image_url: image.url,
        alt_text: image.alt_text,
        is_primary: image.is_primary || index === 0, // La première est primary par défaut
        display_order: index
      }))

      const { error: insertError } = await supabase
        .from('product_images')
        .insert(imagePayloads)

      if (insertError) {
        console.error('❌ Erreur lors de l\'insertion des images:', insertError)
        throw insertError
      }
    }

    console.log(`✅ ${images.length} images configurées`)

  } catch (error) {
    console.error('❌ Erreur lors de la configuration des images:', error)
    throw error
  }
}

// =====================================================
// SUPPRIMER UN PRODUIT
// =====================================================

export async function deleteProductWithAttributes(id: string): Promise<void> {
  try {
    console.log(`🔄 Suppression du produit ${id}`)

    // Les attributs et images seront supprimés automatiquement grâce à ON DELETE CASCADE
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Erreur lors de la suppression du produit:', error)
      throw error
    }

    invalidateProductsCache()
    console.log(`✅ Produit supprimé`)

  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression du produit:', error)
    throw new Error(error?.message || 'Impossible de supprimer le produit')
  }
}

// =====================================================
// STATISTIQUES DES PRODUITS
// =====================================================

export async function getProductsStats(): Promise<ProductStats> {
  try {
    console.log('🔄 Calcul des statistiques des produits')

    const { data, error } = await supabase
      .from('products_stats')
      .select('*')
      .single()

    if (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error)
      throw error
    }

    const stats: ProductStats = {
      total_products: data?.total_products || 0,
      published_products: data?.published_products || 0,
      draft_products: data?.draft_products || 0,
      featured_products: data?.featured_products || 0,
      low_stock_products: data?.low_stock_products || 0,
      out_of_stock_products: data?.out_of_stock_products || 0,
      average_price: data?.average_price || 0,
      total_views: data?.total_views || 0,
      total_purchases: data?.total_purchases || 0
    }

    console.log('✅ Statistiques calculées:', stats)
    return stats

  } catch (error) {
    console.error('❌ Erreur lors du calcul des statistiques:', error)
    return {
      total_products: 0,
      published_products: 0,
      draft_products: 0,
      featured_products: 0,
      low_stock_products: 0,
      out_of_stock_products: 0,
      average_price: 0,
      total_views: 0,
      total_purchases: 0
    }
  }
}

// =====================================================
// UTILITAIRES
// =====================================================

export async function generateProductSKU(name: string, categoryId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .rpc('generate_sku', { 
        product_name: name, 
        category_id: categoryId 
      })

    if (error) {
      console.error('❌ Erreur lors de la génération du SKU:', error)
      // Fallback: générer un SKU simple
      const timestamp = Date.now().toString().slice(-6)
      return `PRD${timestamp}`
    }

    return data || `PRD${Date.now().toString().slice(-6)}`

  } catch (error) {
    console.error('❌ Erreur lors de la génération du SKU:', error)
    return `PRD${Date.now().toString().slice(-6)}`
  }
}

export function validateProductData(data: ProductFormData): string[] {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push('Le nom du produit est obligatoire')
  }

  if (!data.category_id) {
    errors.push('La catégorie est obligatoire')
  }

  if (!data.price || data.price <= 0) {
    errors.push('Le prix doit être supérieur à 0')
  }

  if (data.sale_price && data.sale_price >= data.price) {
    errors.push('Le prix de vente doit être inférieur au prix normal')
  }

  if (data.stock_quantity !== undefined && data.stock_quantity < 0) {
    errors.push('Le stock ne peut pas être négatif')
  }

  return errors
}