// src/app/(dashboard)/categories/modifier/[id]/page.tsx
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getCategory, updateCategory, getCategories } from '@/lib/services/category.service'
import type { Category } from '@/lib/types/category.types'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    image: '',
    seoTitle: '',
    metaDescription: '',
    isActive: true,
    isFeatured: false,
    displayOrder: 1
  })

  useEffect(() => {
    if (categoryId) {
      loadData()
    }
  }, [categoryId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [categoryData, parentsRes] = await Promise.all([
        getCategory(categoryId),
        getCategories({ limit: 100, parentOnly: true })
      ])
      
      if (!categoryData) {
        setError('Catégorie non trouvée')
        return
      }

      setCategory(categoryData)
      setParentCategories(parentsRes.data.filter(c => c.id !== categoryId))
      setFormData({
        name: categoryData.name || '',
        slug: categoryData.slug || '',
        parentId: categoryData.parent_id || '',
        description: categoryData.description || '',
        image: categoryData.icon || categoryData.image_url || '',
        seoTitle: categoryData.meta_title || '',
        metaDescription: categoryData.meta_description || '',
        isActive: categoryData.is_active,
        isFeatured: categoryData.is_featured,
        displayOrder: categoryData.display_order || 1
      })
    } catch (err: any) {
      console.error('Erreur lors du chargement de la catégorie:', err)
      setError(err?.message || 'Erreur lors du chargement de la catégorie')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await updateCategory(categoryId, {
        name: formData.name,
        slug: formData.slug,
        parent_id: formData.parentId ? formData.parentId : null,
        description: formData.description ? formData.description : null,
        image_url: formData.image ? formData.image : null,
        icon: formData.image ? formData.image : null,
        meta_title: formData.seoTitle ? formData.seoTitle : null,
        meta_description: formData.metaDescription ? formData.metaDescription : null,
        is_active: formData.isActive,
        is_featured: formData.isFeatured,
        display_order: Number(formData.displayOrder)
      })

      router.push('/categories?success=updated')
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err)
      setError(err?.message || 'Erreur lors de la mise à jour de la catégorie. Vérifiez les politiques Supabase.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white p-6 rounded-lg border">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !category) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Erreur</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/categories')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Retour aux catégories
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier la catégorie</h1>
          <p className="text-gray-600">
            Modifiez les informations de la catégorie "{category?.name}"
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-end gap-4 mb-6">
          <button
            type="button"
            onClick={() => router.push('/categories')}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sauvegarde...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sauvegarder
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations générales */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie parente
                </label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                >
                  <option value="">Aucune (Catégorie principale)</option>
                  {parentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                />
              </div>
            </div>

            {/* Attributs d'affichage */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Attributs d'affichage</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mise en avant
                  </label>
                  <select
                    name="isFeatured"
                    value={formData.isFeatured ? 'true' : 'false'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                  >
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="isActive"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                  >
                    <option value="true">Active</option>
                    <option value="false">Masquée</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations SEO */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations SEO</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}