// src/lib/services/product.service.ts
import { createClient } from '@/lib/supabase/server'
import { createClient as createClientBrowser } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Product, Category } from '@/lib/types/product.types'

// =====================================================
// RÉCUPÉRER TOUS LES PRODUITS PUBLIÉS (SERVER)
// =====================================================
export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:variants(*),
      images:product_images(*)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur getProducts:', error)
    throw error
  }
  return data as Product[]
}

// =====================================================
// RÉCUPÉRER TOUS LES PRODUITS PUBLIÉS (CLIENT)
// =====================================================
export async function getProductsClient() {
  const supabase = createClientBrowser()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:variants(*),
      images:product_images(*)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur getProductsClient:', error)
    throw error
  }
  return data as Product[]
}

// =====================================================
// RÉCUPÉRER UN PRODUIT PAR SLUG (SERVER)
// =====================================================
export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:variants(*),
      images:product_images(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('Erreur getProductBySlug:', error)
    throw error
  }
  return data as Product
}

// =====================================================
// RÉCUPÉRER UN PRODUIT PAR ID (admin)
// =====================================================
export async function getProductById(id: string) {
  const supabaseAdmin = createAdminClient()
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur getProductById:', error)
    throw error
  }
  return data as Product
}

// =====================================================
// RÉCUPÉRER LES PRODUITS MIS EN AVANT (SERVER)
// =====================================================
export async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:variants(*),
      images:product_images(*)
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .limit(8)

  if (error) {
    console.error('Erreur getFeaturedProducts:', error)
    throw error
  }
  return data as Product[]
}

// =====================================================
// RÉCUPÉRER LES PRODUITS PAR CATÉGORIE (SERVER)
// =====================================================
export async function getProductsByCategory(categorySlug: string) {
  const supabase = await createClient()
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (categoryError) {
    console.error('Erreur getProductsByCategory (catégorie):', categoryError)
    throw categoryError
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:variants(*),
      images:product_images(*)
    `)
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur getProductsByCategory (produits):', error)
    throw error
  }
  return data as Product[]
}

// =====================================================
// RÉCUPÉRER LES PRODUITS PAR CATÉGORIE (CLIENT)
// =====================================================
export async function getProductsByCategoryClient(categorySlug: string) {
  const supabase = createClientBrowser()
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (categoryError) {
    console.error('Erreur getProductsByCategoryClient (catégorie):', categoryError)
    throw categoryError
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:variants(*),
      images:product_images(*)
    `)
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur getProductsByCategoryClient (produits):', error)
    throw error
  }
  return data as Product[]
}

// =====================================================
// CRÉER UN PRODUIT (admin)
// =====================================================
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const supabaseAdmin = createAdminClient()
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      short_description: product.short_description,
      price: product.price,
      sale_price: product.sale_price,
      category_id: product.category_id,
      brand: product.brand,
      gender: product.gender,
      weight: product.weight,
      dimensions: product.dimensions,
      meta_title: product.meta_title,
      meta_description: product.meta_description,
      is_published: product.is_published,
      is_featured: product.is_featured,
      is_active: product.is_active,
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur createProduct:', error)
    throw error
  }
  return data as Product
}

// =====================================================
// METTRE À JOUR UN PRODUIT (admin)
// =====================================================
export async function updateProduct(id: string, product: Partial<Product>) {
  const supabaseAdmin = createAdminClient()
  const { data, error } = await supabaseAdmin
    .from('products')
    .update({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      short_description: product.short_description,
      price: product.price,
      sale_price: product.sale_price,
      category_id: product.category_id,
      brand: product.brand,
      gender: product.gender,
      weight: product.weight,
      dimensions: product.dimensions,
      meta_title: product.meta_title,
      meta_description: product.meta_description,
      is_published: product.is_published,
      is_featured: product.is_featured,
      is_active: product.is_active,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erreur updateProduct:', error)
    throw error
  }
  return data as Product
}

// =====================================================
// SUPPRIMER UN PRODUIT (admin)
// =====================================================
export async function deleteProduct(id: string) {
  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur deleteProduct:', error)
    throw error
  }
  return true
}

// =====================================================
// RÉCUPÉRER TOUTES LES CATÉGORIES
// =====================================================
export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Erreur getCategories:', error)
    throw error
  }
  return data as Category[]
}