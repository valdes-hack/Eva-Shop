// src/lib/types/product-enhanced.types.ts

import type { Category } from '@/lib/types/category.types'

// =====================================================
// TYPES DE BASE
// =====================================================

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string | null
  short_description: string | null
  price: number
  sale_price: number | null
  category_id: string | null
  stock_quantity: number
  reserved_quantity: number
  security_stock: number
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  purchase_count: number
  view_count: number
  weight: number | null
  dimensions: string | null
  meta_title: string | null
  meta_description: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface ProductAttributeValue {
  attribute_id: string
  attribute_name: string
  attribute_slug: string
  attribute_type: 'text' | 'number' | 'select' | 'color' | 'boolean'
  text_value: string | null
  number_value: number | null
  json_value: any | null
  display_value: string | null
  is_inherited: boolean
}

// =====================================================
// PRODUIT AVEC ATTRIBUTS ET RELATIONS
// =====================================================

export interface ProductWithAttributes extends Product {
  // Relations
  category_name?: string
  category_slug?: string
  category?: Category
  
  // Attributs avec leurs valeurs
  attributes: ProductAttributeValue[]
  
  // Images
  images: ProductImage[]
  
  // Champs calculés
  final_price?: number // Prix après réduction
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
  primary_image?: ProductImage
}

// =====================================================
// FORMULAIRES ET DONNÉES D'ENTRÉE
// =====================================================

export interface ProductFormData {
  // Informations de base
  name: string
  slug?: string
  sku?: string
  description?: string
  short_description?: string
  
  // Prix et stock
  price: number
  sale_price?: number | null
  stock_quantity?: number
  security_stock?: number
  
  // Catégorisation
  category_id: string
  tags?: string[]
  
  // Statut
  status?: 'draft' | 'published' | 'archived'
  is_featured?: boolean
  is_active?: boolean
  
  // Propriétés physiques
  weight?: number | null
  dimensions?: string | null
  
  // SEO
  meta_title?: string | null
  meta_description?: string | null
  
  // Images
  images?: Array<{
    url: string
    alt_text?: string
    is_primary?: boolean
  }>
}

export interface ProductAttributesFormData {
  [attributeSlug: string]: any
}

// =====================================================
// FILTRES ET RECHERCHE
// =====================================================

export interface ProductFilters {
  // Recherche textuelle
  search?: string
  
  // Filtres de catégorie
  category_id?: string
  category_slug?: string
  
  // Filtres de statut
  status?: 'draft' | 'published' | 'archived'
  is_featured?: boolean
  is_active?: boolean
  
  // Filtres de prix
  price_min?: number
  price_max?: number
  
  // Filtres de stock
  in_stock?: boolean
  low_stock?: boolean
  out_of_stock?: boolean
  
  // Filtres par attributs
  attributes?: Record<string, string> // attributeSlug -> value
  
  // Tri
  sort_field?: 'name' | 'price' | 'created_at' | 'updated_at' | 'stock_quantity' | 'view_count' | 'purchase_count'
  sort_direction?: 'asc' | 'desc'
  
  // Pagination
  page?: number
  limit?: number
}

// =====================================================
// STATISTIQUES
// =====================================================

export interface ProductStats {
  total_products: number
  published_products: number
  draft_products: number
  featured_products: number
  low_stock_products: number
  out_of_stock_products: number
  average_price: number
  total_views: number
  total_purchases: number
}

export interface CategoryProductStats {
  category_id: string
  category_name: string
  product_count: number
  average_price: number
  total_stock: number
}

// =====================================================
// VARIANTES DE PRODUIT (pour plus tard)
// =====================================================

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price_adjustment: number // Ajustement par rapport au prix de base
  stock_quantity: number
  reserved_quantity: number
  attributes: Record<string, string> // Valeurs spécifiques à cette variante
  images?: ProductImage[]
  is_active: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// RÉPONSES D'API
// =====================================================

export interface ProductsListResponse {
  data: ProductWithAttributes[]
  count: number
  page?: number
  limit?: number
  total_pages?: number
}

export interface ProductResponse {
  data: ProductWithAttributes | null
  error?: string
}

export interface ProductStatsResponse {
  data: ProductStats
  by_category?: CategoryProductStats[]
}

// =====================================================
// UTILITAIRES DE VALIDATION
// =====================================================

export interface ProductValidationError {
  field: string
  message: string
}

export interface ProductValidationResult {
  isValid: boolean
  errors: ProductValidationError[]
}

// =====================================================
// ACTIONS DE PRODUIT
// =====================================================

export type ProductAction = 
  | 'create'
  | 'update' 
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'feature'
  | 'unfeature'
  | 'duplicate'
  | 'archive'
  | 'restore'

export interface ProductActionResult {
  success: boolean
  message: string
  product?: ProductWithAttributes
}

// =====================================================
// HOOKS ET ÉTAT
// =====================================================

export interface UseProductsState {
  products: ProductWithAttributes[]
  loading: boolean
  error: string | null
  stats: ProductStats | null
  filters: ProductFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UseProductFormState {
  product: ProductFormData
  attributes: ProductAttributesFormData
  loading: boolean
  errors: ProductValidationError[]
  isDirty: boolean
}