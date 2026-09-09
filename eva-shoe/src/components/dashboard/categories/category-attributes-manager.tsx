// src/components/dashboard/categories/category-attributes-manager.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  getAttributeTypes, 
  getCategoryAttributes, 
  assignAttributeToCategory, 
  updateCategoryAttribute,
  removeCategoryAttribute 
} from '@/lib/services/attribute.service'
import type { 
  AttributeTypeDefinition, 
  CategoryAttribute,
  CategoryAttributeFormData 
} from '@/lib/types/attribute.types'

interface CategoryAttributesManagerProps {
  categoryId: string
  onAttributesChange?: (attributes: CategoryAttribute[]) => void
}

export default function CategoryAttributesManager({ 
  categoryId, 
  onAttributesChange 
}: CategoryAttributesManagerProps) {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([])
  const [availableAttributes, setAvailableAttributes] = useState<AttributeTypeDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Charger les données initiales
  useEffect(() => {
    if (categoryId) {
      loadData()
    }
  }, [categoryId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Charger les attributs de la catégorie et les types disponibles en parallèle
      const [categoryAttrs, allTypes] = await Promise.all([
        getCategoryAttributes(categoryId),
        getAttributeTypes({ is_active: true })
      ])

      setAttributes(categoryAttrs)
      setAvailableAttributes(allTypes.data)

      if (onAttributesChange) {
        onAttributesChange(categoryAttrs)
      }

    } catch (error) {
      console.error('Erreur lors du chargement des attributs:', error)
      setError('Impossible de charger les attributs')
    } finally {
      setLoading(false)
    }
  }

  // Ajouter un attribut à la catégorie
  const handleAddAttribute = async (attributeId: string, config: Partial<CategoryAttributeFormData>) => {
    try {
      setActionLoading(true)

      const formData: CategoryAttributeFormData = {
        category_id: categoryId,
        attribute_id: attributeId,
        is_required: config.is_required || false,
        is_filterable: config.is_filterable !== false,
        is_visible_in_list: config.is_visible_in_list !== false,
        display_order: config.display_order || attributes.length,
        display_name: config.display_name,
        category_config: config.category_config
      }

      const newAttribute = await assignAttributeToCategory(formData)
      
      setAttributes(prev => [...prev, newAttribute].sort((a, b) => a.display_order - b.display_order))
      setShowAddModal(false)

      if (onAttributesChange) {
        onAttributesChange([...attributes, newAttribute])
      }

    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'attribut:', error)
      setError(error.message || 'Impossible d\'ajouter l\'attribut')
    } finally {
      setActionLoading(false)
    }
  }

  // Mettre à jour un attribut
  const handleUpdateAttribute = async (id: string, updates: Partial<CategoryAttributeFormData>) => {
    try {
      setActionLoading(true)

      const updatedAttribute = await updateCategoryAttribute(id, updates)
      
      setAttributes(prev => 
        prev.map(attr => attr.id === id ? updatedAttribute : attr)
          .sort((a, b) => a.display_order - b.display_order)
      )

      if (onAttributesChange) {
        const updatedList = attributes.map(attr => attr.id === id ? updatedAttribute : attr)
        onAttributesChange(updatedList)
      }

    } catch (error: any) {
      console.error('Erreur lors de la mise à jour d\'attribut:', error)
      setError(error.message || 'Impossible de mettre à jour l\'attribut')
    } finally {
      setActionLoading(false)
    }
  }

  // Supprimer un attribut
  const handleRemoveAttribute = async (id: string, attributeName: string) => {
    if (!confirm(`Supprimer l'attribut "${attributeName}" de cette catégorie ?`)) return

    try {
      setActionLoading(true)

      await removeCategoryAttribute(id)
      
      setAttributes(prev => prev.filter(attr => attr.id !== id))

      if (onAttributesChange) {
        const filteredList = attributes.filter(attr => attr.id !== id)
        onAttributesChange(filteredList)
      }

    } catch (error: any) {
      console.error('Erreur lors de la suppression d\'attribut:', error)
      setError(error.message || 'Impossible de supprimer l\'attribut')
    } finally {
      setActionLoading(false)
    }
  }

  // Attributs disponibles pour ajout (non encore assignés)
  const availableForAdd = availableAttributes.filter(
    attr => !attributes.some(catAttr => catAttr.attribute_id === attr.id)
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Attributs de la catégorie</h3>
          <p className="text-sm text-gray-600">
            Gérez les propriétés que devront renseigner les produits de cette catégorie
          </p>
        </div>
        
        {availableForAdd.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un attribut
          </button>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Liste des attributs actuels */}
      {attributes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">Aucun attribut configuré</p>
          <p className="text-sm text-gray-500">
            Les attributs permettent aux clients de filtrer et comparer les produits
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {attributes.map(attribute => (
            <AttributeItem
              key={attribute.id}
              attribute={attribute}
              onUpdate={(updates) => handleUpdateAttribute(attribute.id, updates)}
              onRemove={() => handleRemoveAttribute(attribute.id, attribute.attribute?.name || 'Attribut')}
              disabled={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Modal d'ajout d'attribut */}
      {showAddModal && (
        <AddAttributeModal
          availableAttributes={availableForAdd}
          onAdd={handleAddAttribute}
          onClose={() => setShowAddModal(false)}
          loading={actionLoading}
        />
      )}
    </div>
  )
}

// Composant pour un attribut individuel
interface AttributeItemProps {
  attribute: CategoryAttribute
  onUpdate: (updates: Partial<CategoryAttributeFormData>) => void
  onRemove: () => void
  disabled: boolean
}

function AttributeItem({ attribute, onUpdate, onRemove, disabled }: AttributeItemProps) {
  const [editing, setEditing] = useState(false)

  const getTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      'text': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      'number': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      'select': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      ),
      'color': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 20v-2m8-10a4 4 0 014 4v2a4 4 0 01-4 4h-1V9h1z" />
        </svg>
      )
    }
    return icons[type] || icons['text']
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-4">
        {/* Icône du type */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          attribute.attribute?.type === 'color' ? 'bg-purple-100 text-purple-600' :
          attribute.attribute?.type === 'number' ? 'bg-blue-100 text-blue-600' :
          attribute.attribute?.type === 'select' ? 'bg-green-100 text-green-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {getTypeIcon(attribute.attribute?.type || 'text')}
        </div>

        {/* Informations */}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900">
              {attribute.display_name || attribute.attribute?.name}
            </h4>
            
            {/* Badges */}
            <div className="flex items-center gap-1">
              {attribute.is_required && (
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                  Obligatoire
                </span>
              )}
              {attribute.is_inherited && (
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Hérité
                </span>
              )}
              {attribute.is_filterable && (
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                  Filtrable
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span>Type: {attribute.attribute?.type}</span>
            <span>Ordre: {attribute.display_order}</span>
            {attribute.attribute?.description && (
              <span className="truncate max-w-xs">
                {attribute.attribute.description}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Toggles rapides */}
        <div className="flex items-center gap-3 mr-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={attribute.is_required}
              onChange={(e) => onUpdate({ is_required: e.target.checked })}
              disabled={disabled || attribute.is_inherited}
              className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C] disabled:opacity-50"
            />
            <span className="ml-1 text-xs text-gray-600">Obligatoire</span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={attribute.is_filterable}
              onChange={(e) => onUpdate({ is_filterable: e.target.checked })}
              disabled={disabled}
              className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C] disabled:opacity-50"
            />
            <span className="ml-1 text-xs text-gray-600">Filtrable</span>
          </label>
        </div>

        {/* Boutons d'action */}
        {!attribute.is_inherited && (
          <button
            onClick={onRemove}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all disabled:opacity-50"
            title="Supprimer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// Modal d'ajout d'attribut
interface AddAttributeModalProps {
  availableAttributes: AttributeTypeDefinition[]
  onAdd: (attributeId: string, config: Partial<CategoryAttributeFormData>) => void
  onClose: () => void
  loading: boolean
}

function AddAttributeModal({ availableAttributes, onAdd, onClose, loading }: AddAttributeModalProps) {
  const [selectedAttributeId, setSelectedAttributeId] = useState('')
  const [isRequired, setIsRequired] = useState(false)
  const [isFilterable, setIsFilterable] = useState(true)
  const [displayName, setDisplayName] = useState('')

  const selectedAttribute = availableAttributes.find(attr => attr.id === selectedAttributeId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAttributeId) return

    onAdd(selectedAttributeId, {
      is_required: isRequired,
      is_filterable: isFilterable,
      display_name: displayName || undefined
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ajouter un attribut</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Sélection d'attribut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'attribut *
            </label>
            <select
              value={selectedAttributeId}
              onChange={(e) => setSelectedAttributeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
              required
            >
              <option value="">Choisir un attribut...</option>
              {availableAttributes.map(attr => (
                <option key={attr.id} value={attr.id}>
                  {attr.name} ({attr.type})
                </option>
              ))}
            </select>
          </div>

          {/* Description de l'attribut sélectionné */}
          {selectedAttribute && selectedAttribute.description && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{selectedAttribute.description}</p>
            </div>
          )}

          {/* Nom d'affichage personnalisé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'affichage (optionnel)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={selectedAttribute?.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Laissez vide pour utiliser le nom par défaut
            </p>
          </div>

          {/* Configuration */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
              />
              <span className="ml-2 text-sm text-gray-700">Attribut obligatoire</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isFilterable}
                onChange={(e) => setIsFilterable(e.target.checked)}
                className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
              />
              <span className="ml-2 text-sm text-gray-700">Utilisable dans les filtres</span>
            </label>
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !selectedAttributeId}
              className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}