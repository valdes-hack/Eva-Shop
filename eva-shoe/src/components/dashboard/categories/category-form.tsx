// src/components/dashboard/categories/category-form.tsx
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getCategories, createCategory } from '@/lib/services/category-optimized.service'
import type { Category } from '@/lib/types/category.types'

export default function CategoryForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    selectedIcon: 'shoe',
    seoTitle: '',
    metaDescription: '',
    status: 'Brouillon', // 'Brouillon' | 'Publié' | 'Masqué'
    isFeatured: false,
    isVisible: true,
    displayOrder: 1
  })

  // SVG Icon definitions matching Market mockup line art
  const iconList = [
    { 
      id: 'shoe', 
      name: 'Chaussures', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l1.5-6h13.5l1.5 6m-16.5 0h16.5m-16.5 0v3.75c0 .414.336.75.75.75h15c.414 0 .75-.336.75-.75V13.5M6 10.5h12" />
    },
    { 
      id: 'shirt', 
      name: 'Vêtements', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0M4.5 9.75l3 1.5 4.5-3 4.5 3 3-1.5V21H4.5V9.75z" />
    },
    { 
      id: 'bag', 
      name: 'Sacs', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.25 0v9.75a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V10.5h15z" />
    },
    { 
      id: 'watch', 
      name: 'Montres', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    },
    { 
      id: 'glasses', 
      name: 'Lunettes', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12c0-1.243 1.007-2.25 2.25-2.25h3a2.25 2.25 0 012.25 2.25v.75a2.25 2.25 0 01-2.25 2.25h-3A2.25 2.25 0 012.25 12.75v-.75zm12 0c0-1.243 1.007-2.25 2.25-2.25h3a2.25 2.25 0 012.25 2.25v.75a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25v-.75zM9.75 12h4.5" />
    },
    { 
      id: 'cap', 
      name: 'Chapeaux', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-4.97 0-9 1.79-9 4 0 1.63 2.21 3.03 5.4 3.66L9 18h6l.6-7.34C18.79 10.03 21 8.63 21 7c0-2.21-4.03-4-9-4z" />
    },
    { 
      id: 'belt', 
      name: 'Ceintures', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12h15m-15 4.5h15m-15-9h15" />
    },
    { 
      id: 'box', 
      name: 'Stockage', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    },
    { 
      id: 'tag', 
      name: 'Promotions', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    },
    { 
      id: 'star', 
      name: 'Favoris', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.415.872-.835.605l-4.73-3.013a.563.563 0 00-.592 0l-4.73 3.013c-.42.267-.951-.117-.835-.605l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    },
    { 
      id: 'spark', 
      name: 'Tendance', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    },
    { 
      id: 'crown', 
      name: 'Premium', 
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 18h18v-2H3v2zm1.2-4.5L7.5 7.5 12 11l4.5-3.5 3.3 6H4.2z" />
    }
  ]

  useEffect(() => {
    loadParentCategories()
  }, [])

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name])

  const loadParentCategories = async () => {
    try {
      const { data } = await getCategories({ 
        limit: 100,
        parentOnly: true 
      })
      setParentCategories(data || [])
    } catch (err) {
      console.error('Erreur lors du chargement des catégories parentes:', err)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, saveAsDraft = false) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const finalStatus = saveAsDraft ? 'Brouillon' : formData.status
    const isActive = finalStatus === 'Publié' && formData.isVisible

    try {
      await createCategory({
        name: formData.name,
        slug: formData.slug,
        parent_id: formData.parentId || null,
        description: formData.description || null,
        image_url: null,
        icon: formData.selectedIcon,
        meta_title: formData.seoTitle || null,
        meta_description: formData.metaDescription || null,
        is_active: isActive,
        is_featured: formData.isFeatured,
        display_order: Number(formData.displayOrder)
      })

      router.push('/categories?success=created')
    } catch (err: any) {
      console.error('Erreur lors de la création de la catégorie:', err)
      setError(err?.message || 'Impossible de créer la catégorie.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const categoryLevelText = formData.parentId ? 'Niveau 2' : 'Niveau 1'
  const activeIconObj = iconList.find(i => i.id === formData.selectedIcon) || iconList[0]

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6 text-gray-900 font-sans">
      {/* Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 font-medium">
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => router.push('/dashboard')}>Tableau de bord</span>
            <span>›</span>
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => router.push('/categories')}>Catégories</span>
            <span>›</span>
            <span className="text-gray-900 font-semibold">Ajouter une catégorie</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ajouter une catégorie</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/categories')}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e as any, true)}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-[#C89B3C] bg-white border border-[#C89B3C] rounded-lg hover:bg-amber-50/50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <svg className="w-4 h-4 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            <span>Enregistrer le brouillon</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#C89B3C] hover:bg-[#b8892f] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Enregistrement...</span>
            ) : (
              <>
                <span className="text-sm font-extrabold">+</span>
                <span>Enregistrer et continuer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (2 Columns wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Informations générales */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Informations générales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Nom de la catégorie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex : Chaussures"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent transition-all placeholder:text-gray-400"
                  required
                />
                <p className="text-[11px] text-gray-400 mt-1">Le nom de la catégorie (requis)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="ex : chaussures"
                    className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent font-mono transition-all placeholder:text-gray-400"
                    required
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Utilisé dans l'URL. Ex : votre-site.com/chaussures</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Catégorie parente
                </label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent text-gray-700 cursor-pointer"
                >
                  <option value="">Aucune (Catégorie principale)</option>
                  {parentCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">Sélectionnez la catégorie parent (si existante)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Niveau
                </label>
                <select
                  disabled
                  value={categoryLevelText}
                  className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-500 font-semibold cursor-not-allowed appearance-none"
                >
                  <option value="Niveau 1">Niveau 1</option>
                  <option value="Niveau 2">Niveau 2</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">Le niveau est défini automatiquement</p>
              </div>
            </div>

            {/* Rich Text Editor Mockup */}
            <div className="pt-1">
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                Description
              </label>

              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#C89B3C] focus-within:ring-1 focus-within:ring-[#C89B3C]">
                {/* Editor Toolbar */}
                <div className="bg-gray-50 border-b border-gray-200 p-1.5 flex items-center gap-1.5 flex-wrap">
                  <select className="bg-transparent text-xs text-gray-700 font-medium px-2 py-1 rounded hover:bg-gray-200/60 border-none cursor-pointer">
                    <option>Paragraphe</option>
                    <option>Titre 1</option>
                    <option>Titre 2</option>
                  </select>

                  <div className="h-4 w-px bg-gray-300 mx-0.5"></div>

                  <button type="button" className="p-1.5 text-xs font-extrabold text-gray-700 hover:bg-gray-200/70 rounded w-7 h-7 flex items-center justify-center">B</button>
                  <button type="button" className="p-1.5 text-xs italic font-bold text-gray-700 hover:bg-gray-200/70 rounded w-7 h-7 flex items-center justify-center">I</button>
                  <button type="button" className="p-1.5 text-xs underline text-gray-700 hover:bg-gray-200/70 rounded w-7 h-7 flex items-center justify-center">U</button>

                  <div className="h-4 w-px bg-gray-300 mx-0.5"></div>

                  <button type="button" className="p-1 text-gray-600 hover:bg-gray-200/70 rounded p-1" title="Liste à puces">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </button>
                  <button type="button" className="p-1 text-gray-600 hover:bg-gray-200/70 rounded p-1" title="Liste numérotée">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h13M7 12h13M7 16h13M3 8h.01M3 12h.01M3 16h.01" /></svg>
                  </button>

                  <div className="h-4 w-px bg-gray-300 mx-0.5"></div>

                  <button type="button" className="p-1 text-gray-600 hover:bg-gray-200/70 rounded p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M9 18h6" /></svg>
                  </button>
                  <button type="button" className="p-1 text-gray-600 hover:bg-gray-200/70 rounded p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /></svg>
                  </button>
                </div>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                  placeholder="Décrivez cette catégorie..."
                  className="w-full p-3 text-xs bg-white text-gray-800 border-none focus:outline-none resize-y placeholder:text-gray-400"
                />

                <div className="bg-gray-50 border-t border-gray-100 px-3 py-1.5 text-right text-[11px] text-gray-400 font-mono">
                  {formData.description.length}/500
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Image et icône */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Image et icône
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Image de couverture */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Image de couverture
                </label>
                <div className="border border-dashed border-gray-300 bg-gray-50/50 rounded-xl p-5 text-center space-y-2 hover:bg-amber-50/30 hover:border-[#C89B3C] transition-colors cursor-pointer">
                  <svg className="w-6 h-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-xs text-gray-600 font-medium">Glissez-déposez une image ici</p>
                  <p className="text-[11px] text-gray-400">ou</p>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Parcourir les fichiers
                  </button>
                  <p className="text-[10px] text-gray-400 pt-1">
                    Format accepté : JPG, PNG, WEBP<br />Taille max : 2 Mo
                  </p>
                </div>
              </div>

              {/* Icône Grid */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Icône <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>

                <div className="grid grid-cols-6 gap-2 p-1">
                  {iconList.map((icon) => (
                    <button
                      key={icon.id}
                      type="button"
                      title={icon.name}
                      onClick={() => setFormData(prev => ({ ...prev, selectedIcon: icon.id }))}
                      className={`h-11 border rounded-lg flex items-center justify-center transition-all ${
                        formData.selectedIcon === icon.id
                          ? 'border-[#C89B3C] text-[#C89B3C] bg-white ring-2 ring-[#C89B3C]/30 shadow-xs'
                          : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icon.path}
                      </svg>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-gray-400 mt-2">
                  Choisissez une icône ou téléchargez la vôtre
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Attributs d'affichage */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Attributs d'affichage
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Ordre */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
                />
                <p className="text-[11px] text-gray-400 mt-1">Position de la catégorie dans la liste</p>
              </div>

              {/* Mise en avant Toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Mise en avant
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      formData.isFeatured ? 'bg-[#C89B3C]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        formData.isFeatured ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Afficher cette catégorie en avant sur le site</p>
              </div>

              {/* Visible sur le site Toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Visible sur le site
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      formData.isVisible ? 'bg-[#C89B3C]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        formData.isVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Activer pour rendre visible aux clients</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          
          {/* Card 1: Statut */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Statut
            </h2>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-800">Statut de publication</p>

              {[
                { id: 'Brouillon', label: 'Brouillon', desc: 'Enregistré comme brouillon' },
                { id: 'Publié', label: 'Publié', desc: 'Visible sur le site' },
                { id: 'Masqué', label: 'Masqué', desc: 'Caché du site (non affiché aux clients)' }
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="status"
                    value={item.id}
                    checked={formData.status === item.id}
                    onChange={handleChange}
                    className="mt-0.5 text-[#C89B3C] focus:ring-[#C89B3C] accent-[#C89B3C]"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#C89B3C] transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Card 2: Informations SEO */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Informations SEO <span className="text-gray-400 font-normal text-xs">(optionnel)</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Titre SEO
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="Ex : Chaussures tendance pour homme et femme"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 mt-1">Titre affiché sur les moteurs de recherche (max 60 caractères)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Meta description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ex : Découvrez notre collection de chaussures pour tous les styles et toutes les occasions."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 mt-1">Description pour les moteurs de recherche (max 160 caractères)</p>
              </div>
            </div>
          </div>

          {/* Card 3: Aperçu */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              Aperçu
            </h2>
            <p className="text-[11px] text-gray-400">Voici un aperçu de l'affichage de la catégorie</p>

            <div className="border border-gray-200/80 rounded-xl p-5 bg-white flex items-center gap-4 shadow-2xs">
              <div className="w-16 h-16 bg-[#FFF8EC] rounded-full flex items-center justify-center text-[#C89B3C] flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {activeIconObj.path}
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-gray-900 text-sm truncate">
                    {formData.name || 'Nom de la catégorie'}
                  </h4>
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                    {categoryLevelText}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1">Nombre de produits</p>
                <p className="text-xs text-gray-700 font-semibold">0 produit</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </form>
  )
}