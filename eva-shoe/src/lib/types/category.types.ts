// src/lib/types/category.types.ts

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  parent_name?: string
  image_url?: string
  icon?: string
  display_order: number
  is_featured: boolean
  is_active: boolean
  products_count: number
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at?: string
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  parent_id?: string
  image_url?: string
  icon?: string
  display_order: number
  is_featured: boolean
  is_active: boolean
  meta_title?: string
  meta_description?: string
}

export interface CategoryFilters {
  search?: string
  parent_id?: string
  is_active?: boolean
  is_featured?: boolean
  sort_field?: keyof Category
  sort_direction?: 'asc' | 'desc'
}

export interface CategoryStats {
  total: number
  active: number
  featured: number
  totalProducts: number
}