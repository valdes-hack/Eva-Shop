// src/lib/types/category.types.ts

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parent_id?: string | null
  parent_name?: string
  image_url?: string | null
  banner_image_url?: string | null
  icon?: string | null
  display_order: number
  is_featured: boolean
  is_active: boolean
  products_count?: number
  meta_title?: string | null
  meta_description?: string | null
  presentation_text?: string | null
  seo_keywords?: string | null
  hierarchy_path?: string | null
  created_at: string
  updated_at?: string | null
  // Additional properties for UI
  children?: Category[]
  products?: any[]
  parent?: { name: string } | { name: string }[] | null
  attributes?: CategoryAttribute[]
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string | null
  parent_id?: string | null
  image_url?: string | null
  banner_image_url?: string | null
  icon?: string | null
  display_order: number
  is_featured: boolean
  is_active: boolean
  meta_title?: string | null
  meta_description?: string | null
  presentation_text?: string | null
  seo_keywords?: string | null
}

export interface CategoryFilters {
  search?: string
  parent_id?: string | null
  is_active?: boolean
  is_featured?: boolean
  sort_field?: keyof Category
  sort_direction?: 'asc' | 'desc'
  page?: number
  limit?: number
  parentOnly?: boolean
}

export interface CategoryStats {
  total: number
  active: number
  hidden: number
  subcategories: number
}

// Types pour le système d'attributs
export interface Attribute {
  id: string
  name: string
  slug: string
  type: 'text' | 'number' | 'select' | 'multi_select' | 'color' | 'size'
  description?: string | null
  is_required: boolean
  validation_rules?: any
  display_order: number
  is_active: boolean
  created_at: string
  updated_at?: string | null
  values?: AttributeValue[]
}

export interface AttributeValue {
  id: string
  attribute_id: string
  value: string
  display_name: string
  color_code?: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface CategoryAttribute {
  id: string
  category_id: string
  attribute_id: string
  is_required: boolean
  is_inherited: boolean
  display_order: number
  created_at: string
  attribute: Attribute
}

export interface ProductAttributeValue {
  id: string
  product_id: string
  attribute_id: string
  attribute_value_id?: string | null
  text_value?: string | null
  number_value?: number | null
  created_at: string
  attribute: Attribute
  attribute_value?: AttributeValue | null
}

export interface CategoryHierarchy {
  id: string
  name: string
  slug: string
  level: number
  path: string
  children: CategoryHierarchy[]
  parent_id?: string | null
  attributes_count: number
  products_count: number
}