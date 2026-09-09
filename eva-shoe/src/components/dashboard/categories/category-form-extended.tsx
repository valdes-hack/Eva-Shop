// src/components/dashboard/categories/category-form-extended.tsx
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getCategoryHierarchy, createCategory, getCategoryWithAttributes } from '@/lib/services/category-optimized.service'
import { getCategoryAttributes, addAttributeToCategory, removeAttributeFromCategory } from '@/lib/services/category-attributes.service'
import type { Category, CategoryFormData, CategoryAttribute } from '@/lib/types/category.types'

interface CategoryFormExtendedProps {
  categoryId?: string // Pour l'édition
  onSuccess?: (category: Category) => void
  onCancel?: () => void
}

export default function CategoryFormExtended({ 
  categoryId, 
  onSuccess, 
  onCancel 
}: CategoryFormExtendedProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([])
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'attributes'>('general')
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parent_id: null,
    image_url: '',
    banner_image_url: '',
    icon: 'folder',
    display_order: 1,
    is_featured: false,
    is_active: true,
    meta_title: '',
    meta_description: '',
    presentation_text: '',
    seo_keywords: ''
  })

  // Icônes disponibles pour les catégories
  const iconOptions = [
    { value: 'folder', label: 'Dossier', icon: '📁' },
    { value: 'shoe', label: 'Chaussures', icon: '👟' },
    { value: 'shirt', label: 'Vêtements', icon: '👕' },
    { value: 'bag', label: 'Sacs', icon: '👜' },
    { value: 'watch', label: 'Montres', icon: '⌚' },
    { value: 'glasses', label: 'Lunettes', icon: '👓' },
    { value: 'cap', label: 'Chapeaux', icon: '🧢' },
    { value: 'belt', label: 'Ceintures', icon: '👔' },
    { value: 'jewelry', label: 'Bijoux', icon: '💍' },
    { value: 'star', label: 'Favoris', icon: '⭐' }
  ]

  useEffect(() => {
    loadInitialData()
  }, [categoryId])

  const loadInitialData = async () => {
    try {
      // Charger les catégories parentes
      const hierarchy = await getCategoryHierarchy()
      setParentCategories(hierarchy)

      // Si en mode édition, charger la catégorie
      if (categoryId) {
        const category = await getCategoryWithAttributes(categoryId)
        if (category) {
          setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            parent_id: category.parent_id,
            image_url: category.image_url || '',
            banner_image_url: category.banner_image_url || '',
            icon: category.icon || 'folder',
            display_order: category.display_order,
            is_featured: category.is_featured,
            is_active: category.is_active,
            meta_title: category.meta_title || '',
            meta_description: category.meta_description || '',
            presentation_text: category.presentation_text || '',
            seo_keywords: category.seo_keywords || ''
          })

          // Charger les attributs
          if (category.attributes) {
            setCategoryAttributes(category.attributes)
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      setError('Impossible de charger les données')
    }
  }

  // Auto-génération du slug
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      let result: Category

      if (categoryId) {
        // Mode édition - TODO: implémenter updateCategory
        throw new Error('Mode édition pas encore implémenté')
      } else {
        // Mode création
        result = await createCategory(formData)
      }

      if (onSuccess) {
        onSuccess(result)
      } else {
        router.push('/categories')
      }
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      {/* Informations de base */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la catégorie *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
            placeholder="Ex: Chaussures femme"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL (slug) *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
            placeholder="chaussures-femme"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          placeholder="Description de la catégorie..."
        />
      </div>

      {/* Catégorie parente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie parente
        </label>
        <select
          value={formData.parent_id || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
        >
          <option value="">Aucune (catégorie racine)</option>
          {parentCategories.map(category => renderCategoryOption(category, 0))}
        </select>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image principale
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
            placeholder="https://exemple.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de bannière
          </label>
          <input
            type="url"
            value={formData.banner_image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, banner_image_url: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
            placeholder="https://exemple.com/banniere.jpg"
          />
        </div>
      </div>

      {/* Icône et paramètres */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icône
          </label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          >
            {iconOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordre d'affichage
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
            />
            <label className="ml-2 text-sm text-gray-700">Catégorie mise en avant</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
            />
            <label className="ml-2 text-sm text-gray-700">Catégorie active</label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Optimisation SEO</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Ces informations améliorent le référencement de votre catégorie dans les moteurs de recherche.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre SEO (Meta Title)
        </label>
        <input
          type="text"
          value={formData.meta_title}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
          maxLength={60}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          placeholder="Titre optimisé pour les moteurs de recherche"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.meta_title?.length || 0}/60 caractères recommandés
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description SEO (Meta Description)
        </label>
        <textarea
          value={formData.meta_description}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
          maxLength={160}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          placeholder="Description affichée dans les résultats de recherche"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.meta_description?.length || 0}/160 caractères recommandés
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mots-clés SEO
        </label>
        <input
          type="text"
          value={formData.seo_keywords}
          onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          placeholder="chaussures, femme, mode, élégante"
        />
        <p className="mt-1 text-xs text-gray-500">
          Séparez les mots-clés par des virgules
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Texte de présentation
        </label>
        <textarea
          value={formData.presentation_text}
          onChange={(e) => setFormData(prev => ({ ...prev, presentation_text: e.target.value }))}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          placeholder="Texte d'introduction affiché en haut de la page catégorie..."
        />
      </div>
    </div>
  )

  const renderAttributesTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Gestion des attributs</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>La gestion complète des attributs sera disponible après la création de la catégorie.</p>
            </div>
          </div>
        </div>
      </div>

      {categoryAttributes.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Attributs assignés</h4>
          <div className="space-y-3">
            {categoryAttributes.map(attr => (
              <div key={attr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{attr.attribute.name}</span>
                  <span className="ml-2 text-sm text-gray-500">({attr.attribute.type})</span>
                  {attr.is_required && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Obligatoire
                    </span>
                  )}
                  {attr.is_inherited && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Hérité
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderCategoryOption = (category: Category, depth: number): React.ReactNode => {
    const prefix = '—'.repeat(depth)
    return (
      <>
        <option key={category.id} value={category.id}>
          {prefix} {category.name}
        </option>
        {category.children?.map(child => renderCategoryOption(child, depth + 1))}
      </>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {categoryId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {[
            { key: 'general', label: 'Informations générales' },
            { key: 'seo', label: 'SEO & Présentation' },
            { key: 'attributes', label: 'Attributs' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-[#C89B3C] text-[#C89B3C]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-6 py-6">
          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Tab content */}
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'seo' && renderSEOTab()}
          {activeTab === 'attributes' && renderAttributesTab()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel || (() => router.back())}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {categoryId ? 'Mettre à jour' : 'Créer la catégorie'}
          </button>
        </div>
      </form>
    </div>
  )
}