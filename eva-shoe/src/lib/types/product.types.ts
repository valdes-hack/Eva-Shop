// src/lib/types/product.types.ts

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
  brand: string | null
  gender: string | null
  weight: number | null
  dimensions: string | null
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  // Relations
  category?: Category
  variants?: Variant[]
  images?: ProductImage[]
}

export interface Variant {
  id: string
  product_id: string
  size: string | null
  color: string | null
  sku: string
  price: number | null
  stock_quantity: number
  reserved_quantity: number
  security_stock: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  image_url: string | null
  icon: string | null
  display_order: number
  is_featured: boolean
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  // Relations
  children?: Category[]
  parent?: Category
  products?: Product[]
}

export interface ProductImage {
  id: string
  product_id: string
  variant_id: string | null
  image_url: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
  created_at: string
}