// src/lib/services/product-client.service.ts
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types/product.types'

const supabase = createClient()

// =====================================================
// RÉCUPÉRER TOUS LES PRODUITS PUBLIÉS (CLIENT)
// =====================================================
export async function getProducts() {
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
// RÉCUPÉRER LES PRODUITS PAR CATÉGORIE (CLIENT)
// =====================================================
export async function getProductsByCategory(categorySlug: string) {
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
// RÉCUPÉRER LES PRODUITS MIS EN AVANT (CLIENT)
// =====================================================
export async function getFeaturedProducts() {
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