// src/components/dashboard/categories/category-form-with-icons.tsx
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { getCategoryHierarchy, createCategory, getCategoryWithAttributes, updateCategory } from '@/lib/services/category-optimized.service'
import { getCategoryAttributes } from '@/lib/services/attribute.service'
import CategoryAttributesManager from './category-attributes-manager'
import type { Category, CategoryFormData, CategoryAttribute } from '@/lib/types/category.types'

interface CategoryFormWithIconsProps {
  categoryId?: string
  onSuccess?: (category: Category) => void
  onCancel?: () => void
}

export default function CategoryFormWithIcons({ 
  categoryId, 
  onSuccess, 
  onCancel 
}: CategoryFormWithIconsProps) {
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

  // Icônes SVG disponibles
  const iconOptions = [
    { 
      value: 'folder', 
      label: 'Dossier', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    { 
      value: 'shoe', 
      label: 'Chaussures', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l1.5-6h13.5l1.5 6m-16.5 0h16.5m-16.5 0v3.75c0 .414.336.75.75.75h15c.414 0 .75-.336.75-.75V13.5M6 10.5h12" />
        </svg>
      )
    },
    { 
      value: 'shirt', 
      label: 'Vêtements', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0M4.5 9.75l3 1.5 4.5-3 4.5 3 3-1.5V21H4.5V9.75z" />
        </svg>
      )
    },
    { 
      value: 'bag', 
      label: 'Sacs', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.25 0v9.75a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V10.5h15z" />
        </svg>
      )
    },
    { 
      value: 'watch', 
      label: 'Montres', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'glasses', 
      label: 'Lunettes', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12c0-1.243 1.007-2.25 2.25-2.25h3a2.25 2.25 0 012.25 2.25v.75a2.25 2.25 0 01-2.25 2.25h-3A2.25 2.25 0 012.25 12.75v-.75zm12 0c0-1.243 1.007-2.25 2.25-2.25h3a2.25 2.25 0 012.25 2.25v.75a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25v-.75zM9.75 12h4.5" />
        </svg>
      )
    },
    { 
      value: 'cap', 
      label: 'Chapeaux', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-4.97 0-9 1.79-9 4 0 1.63 2.21 3.03 5.4 3.66L9 18h6l.6-7.34C18.79 10.03 21 8.63 21 7c0-2.21-4.03-4-9-4z" />
        </svg>
      )
    },
    { 
      value: 'belt', 
      label: 'Ceintures', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12h15m-15 4.5h15m-15-9h15" />
        </svg>
      )
    },
    { 
      value: 'jewelry', 
      label: 'Bijoux', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      )
    },
    { 
      value: 'star', 
      label: 'Favoris', 
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.415.872-.835.605l-4.73-3.013a.563.563 0 00-.592 0l-4.73 3.013c-.42.267-.951-.117-.835-.605l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )
    }
  ]
  useEffect(() => {
    loadInitialData()
  }, [categoryId])

  const loadInitialData = async () => {
    try {
      const hierarchy = await getCategoryHierarchy()
      setParentCategories(hierarchy)

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

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: categoryId && prev.slug ? prev.slug : name.toLowerCase()
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
        result = await updateCategory(categoryId, formData)
      } else {
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
  const selectedIconOption = iconOptions.find(icon => icon.value === formData.icon) || iconOptions[0]

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
          {formData.image_url && (
            <div className="mt-2">
              <img 
                src={formData.image_url} 
                alt="Aperçu" 
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
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
          {formData.banner_image_url && (
            <div className="mt-2">
              <img 
                src={formData.banner_image_url} 
                alt="Aperçu bannière" 
                className="w-full h-16 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Icône et paramètres */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icône
          </label>
          <div className="relative mb-3">
            <select
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent appearance-none pr-10"
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              {selectedIconOption.svg}
            </div>
          </div>
          
          {/* Grille d'icônes visuelles */}
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, icon: option.value }))}
                className={`p-3 border rounded-lg hover:border-[#C89B3C] transition-colors ${
                  formData.icon === option.value 
                    ? 'border-[#C89B3C] bg-[#C89B3C]/10 text-[#C89B3C]' 
                    : 'border-gray-300 text-gray-600'
                }`}
                title={option.label}
              >
                {option.svg}
              </button>
            ))}
          </div>
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

        <div className="flex flex-col gap-4">
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
        <h3 className="text-sm font-medium text-blue-800">Optimisation SEO</h3>
        <p className="mt-2 text-sm text-blue-700">
          Ces informations améliorent le référencement de votre catégorie.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre SEO (Meta Title)
        </label>
        <input
          type="text"
          value={formData.meta_title || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
          maxLength={60}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          placeholder="Titre optimisé pour les moteurs de recherche"
        />
        <p className="mt-1 text-xs text-gray-500">
          {(formData.meta_title || '').length}/60 caractères recommandés
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description SEO (Meta Description)
        </label>
        <textarea
          value={formData.meta_description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
          maxLength={160}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          placeholder="Description affichée dans les résultats de recherche"
        />
        <p className="mt-1 text-xs text-gray-500">
          {(formData.meta_description || '').length}/160 caractères recommandés
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mots-clés SEO
        </label>
        <input
          type="text"
          value={formData.seo_keywords || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          placeholder="chaussures, femme, mode, élégante"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Texte de présentation
        </label>
        <textarea
          value={formData.presentation_text || ''}
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
      {categoryId ? (
        <CategoryAttributesManager
          categoryId={categoryId}
          onAttributesChange={setCategoryAttributes}
        />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800">Gestion des attributs</h3>
          <p className="mt-2 text-sm text-yellow-700">
            La gestion des attributs sera disponible après la création de la catégorie.
            Vous pourrez ensuite définir les propriétés que devront renseigner les produits (couleur, taille, pointure, etc.).
          </p>
        </div>
      )}
    </div>
  )

  const renderCategoryOption = (category: Category, depth: number): React.ReactNode => {
    const prefix = '—'.repeat(depth)
    return (
      <React.Fragment key={category.id}>
        <option value={category.id}>
          {prefix} {category.name}
        </option>
        {category.children?.map(child => renderCategoryOption(child, depth + 1))}
      </React.Fragment>
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