// src/lib/types/attribute.types.ts
// Types pour le système de gestion des attributs

export type AttributeType = 'text' | 'number' | 'select' | 'multiselect' | 'color' | 'size'

export interface AttributeTypeDefinition {
  id: string
  name: string
  slug: string
  type: AttributeType
  
  // Configuration
  options?: {
    values?: string[]
    allow_custom?: boolean
    numeric?: boolean
    size_chart?: string
    [key: string]: any
  }
  
  validation_rules?: {
    required?: boolean
    min?: number
    max?: number
    max_length?: number
    pattern?: string
    [key: string]: any
  }
  
  display_config?: {
    format?: 'badge' | 'text' | 'color' | 'list'
    color_preview?: boolean
    show_in_title?: boolean
    [key: string]: any
  }
  
  // Métadonnées
  description?: string
  is_system: boolean
  is_active: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface CategoryAttribute {
  id: string
  category_id: string
  attribute_id: string
  
  // Configuration
  is_required: boolean
  is_inherited: boolean
  is_filterable: boolean
  is_visible_in_list: boolean
  
  // Affichage
  display_order: number
  display_name?: string
  
  // Configuration spécifique
  category_config?: {
    default_value?: any
    show_in_title?: boolean
    custom_validation?: any
    [key: string]: any
  }
  
  // Relations
  attribute?: AttributeTypeDefinition
  category?: {
    id: string
    name: string
    slug: string
  }
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface ProductAttribute {
  id: string
  product_id: string
  attribute_id: string
  
  // Valeurs selon le type
  text_value?: string
  number_value?: number
  json_value?: any
  
  // Relations
  attribute?: AttributeTypeDefinition
  
  // Timestamps
  created_at: string
  updated_at: string
}

// Types pour les formulaires
export interface AttributeTypeFormData {
  name: string
  slug: string
  type: AttributeType
  options?: Record<string, any>
  validation_rules?: Record<string, any>
  display_config?: Record<string, any>
  description?: string
  is_active?: boolean
}

export interface CategoryAttributeFormData {
  category_id: string
  attribute_id: string
  is_required?: boolean
  is_filterable?: boolean
  is_visible_in_list?: boolean
  display_order?: number
  display_name?: string
  category_config?: Record<string, any>
}

export interface ProductAttributeFormData {
  product_id: string
  attribute_id: string
  text_value?: string
  number_value?: number
  json_value?: any
}

// Types pour les filtres
export interface AttributeFilters {
  search?: string
  type?: AttributeType
  is_active?: boolean
  is_system?: boolean
  category_id?: string
  page?: number
  limit?: number
  sort_field?: string
  sort_direction?: 'asc' | 'desc'
}

// Types pour les statistiques
export interface AttributeStats {
  total_types: number
  by_type: Record<AttributeType, number>
  most_used: Array<{
    id: string
    name: string
    usage_count: number
  }>
  categories_with_attributes: number
}

// Types pour l'affichage des valeurs
export interface AttributeValue {
  attribute: AttributeTypeDefinition
  value: any
  display_value: string
  formatted_value?: string
}

// Configuration prédéfinie des attributs par catégorie
export interface CategoryAttributeTemplate {
  category_slug: string
  required_attributes: string[] // slugs des attributs obligatoires
  optional_attributes: string[] // slugs des attributs optionnels
  specific_config?: Record<string, any>
}

// Templates prédéfinis selon le CdCF
export const CATEGORY_ATTRIBUTE_TEMPLATES: CategoryAttributeTemplate[] = [
  {
    category_slug: 'vetements',
    required_attributes: ['taille-vetement', 'couleur'],
    optional_attributes: ['marque', 'matiere', 'coupe', 'style', 'collection', 'entretien']
  },
  {
    category_slug: 'vetements-homme', 
    required_attributes: ['taille-vetement', 'couleur'],
    optional_attributes: ['marque', 'matiere', 'coupe', 'style']
  },
  {
    category_slug: 'vetements-femme',
    required_attributes: ['taille-vetement', 'couleur'], 
    optional_attributes: ['marque', 'matiere', 'coupe', 'style', 'longueur']
  },
  {
    category_slug: 'vetements-enfant',
    required_attributes: ['taille-vetement', 'couleur'],
    optional_attributes: ['marque', 'matiere']
  },
  {
    category_slug: 'chaussures',
    required_attributes: ['pointure', 'couleur'],
    optional_attributes: ['marque', 'matiere', 'type-chaussure']
  },
  {
    category_slug: 'chaussures-homme',
    required_attributes: ['pointure', 'couleur'],
    optional_attributes: ['marque', 'matiere']
  },
  {
    category_slug: 'chaussures-femme',
    required_attributes: ['pointure', 'couleur'],
    optional_attributes: ['marque', 'matiere', 'hauteur-talon']
  },
  {
    category_slug: 'accessoires',
    required_attributes: ['couleur'],
    optional_attributes: ['marque', 'matiere', 'type-accessoire']
  }
]

// Helpers pour la validation des valeurs
export function validateAttributeValue(
  attribute: AttributeTypeDefinition, 
  value: any
): { valid: boolean; error?: string } {
  const rules = attribute.validation_rules || {}
  
  // Vérification obligatoire
  if (rules.required && (!value || value === '')) {
    return { valid: false, error: `${attribute.name} est obligatoire` }
  }
  
  // Validation selon le type
  switch (attribute.type) {
    case 'text':
      if (typeof value !== 'string') {
        return { valid: false, error: 'Valeur texte attendue' }
      }
      if (rules.max_length && value.length > rules.max_length) {
        return { valid: false, error: `Maximum ${rules.max_length} caractères` }
      }
      break
      
    case 'number':
      const num = Number(value)
      if (isNaN(num)) {
        return { valid: false, error: 'Valeur numérique attendue' }
      }
      if (rules.min !== undefined && num < rules.min) {
        return { valid: false, error: `Minimum ${rules.min}` }
      }
      if (rules.max !== undefined && num > rules.max) {
        return { valid: false, error: `Maximum ${rules.max}` }
      }
      break
      
    case 'select':
      const options = attribute.options?.values || []
      if (!attribute.options?.allow_custom && !options.includes(value)) {
        return { valid: false, error: 'Valeur non autorisée' }
      }
      break
      
    case 'multiselect':
      if (!Array.isArray(value)) {
        return { valid: false, error: 'Tableau de valeurs attendu' }
      }
      const allowedValues = attribute.options?.values || []
      for (const val of value) {
        if (!attribute.options?.allow_custom && !allowedValues.includes(val)) {
          return { valid: false, error: `Valeur "${val}" non autorisée` }
        }
      }
      break
  }
  
  return { valid: true }
}

// Helpers pour l'affichage
export function formatAttributeValue(
  attribute: AttributeTypeDefinition,
  value: any
): string {
  if (!value) return ''
  
  switch (attribute.type) {
    case 'multiselect':
      return Array.isArray(value) ? value.join(', ') : String(value)
    case 'color':
      return typeof value === 'object' && value.name ? value.name : String(value)
    default:
      return String(value)
  }
}

export function getAttributeDisplayValue(productAttribute: ProductAttribute): string {
  if (!productAttribute.attribute) return ''
  
  let value: any
  switch (productAttribute.attribute.type) {
    case 'text':
      value = productAttribute.text_value
      break
    case 'number':
      value = productAttribute.number_value
      break
    default:
      value = productAttribute.json_value
      break
  }
  
  return formatAttributeValue(productAttribute.attribute, value)
}