// src/components/dashboard/categories/categories-table.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
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
  created_at: string
  updated_at?: string
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Category>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    // TODO: Fetch real data from API
    // Mock data for now
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Chaussures Femme',
        slug: 'chaussures-femme',
        description: 'Collection de chaussures élégantes pour femmes',
        image_url: '/images/cat-femme.png',
        icon: '👠',
        display_order: 1,
        is_featured: true,
        is_active: true,
        products_count: 45,
        created_at: '2026-08-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Chaussures Homme',
        slug: 'chaussures-homme',
        description: 'Collection de chaussures modernes pour hommes',
        image_url: '/images/cat-homme.png',
        icon: '👞',
        display_order: 2,
        is_featured: true,
        is_active: true,
        products_count: 38,
        created_at: '2026-08-15T10:05:00Z'
      },
      {
        id: '3',
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Baskets tendance pour tous les styles',
        image_url: '/images/cat-sneakers.png',
        icon: '👟',
        display_order: 3,
        is_featured: true,
        is_active: true,
        products_count: 67,
        created_at: '2026-08-15T10:10:00Z'
      },
      {
        id: '4',
        name: 'Chaussures Enfant',
        slug: 'chaussures-enfant',
        description: 'Chaussures confortables pour enfants',
        image_url: '/images/cat-enfant.png',
        icon: '👶',
        display_order: 4,
        is_featured: false,
        is_active: true,
        products_count: 28,
        created_at: '2026-08-15T10:15:00Z'
      },
      {
        id: '5',
        name: 'Accessoires',
        slug: 'accessoires',
        description: 'Sacs, ceintures et autres accessoires',
        image_url: '/images/cat-accessoires.png',
        icon: '👜',
        display_order: 5,
        is_featured: false,
        is_active: true,
        products_count: 22,
        created_at: '2026-08-15T10:20:00Z'
      },
      {
        id: '6',
        name: 'Bottes Hiver',
        slug: 'bottes-hiver',
        description: 'Bottes chaudes pour la saison froide',
        parent_id: '2',
        parent_name: 'Chaussures Homme',
        icon: '🥾',
        display_order: 6,
        is_featured: false,
        is_active: false,
        products_count: 15,
        created_at: '2026-08-15T10:25:00Z'
      }
    ]

    setTimeout(() => {
      setCategories(mockCategories)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleSort = (field: keyof Category) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(categories.map(c => c.id))
    }
  }

  const sortedCategories = [...categories].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCategories.length} catégorie{selectedCategories.length > 1 ? 's' : ''} sélectionnée{selectedCategories.length > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                Activer
              </button>
              <button className="px-3 py-1 text-sm bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                Désactiver
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === categories.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
                />
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Catégorie
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('products_count')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  Produits
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              </th>
              <th className="px-6 py-3 text-center">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </span>
              </th>
              <th className="px-6 py-3 text-center">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vedette
                </span>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleSelectCategory(category.id)}
                    className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {category.image_url ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {category.icon || '📂'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-sm text-gray-500 truncate">
                          {category.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        /{category.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {category.parent_name ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {category.parent_name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Racine</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {category.products_count}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {category.is_featured ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C89B3C] text-white">
                      ⭐ Vedette
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/categories/${category.id}`}
                      className="text-[#C89B3C] hover:text-[#b8892f] text-sm font-medium"
                    >
                      Modifier
                    </Link>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">1</span> à{' '}
            <span className="font-medium">{categories.length}</span> sur{' '}
            <span className="font-medium">{categories.length}</span> résultats
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
              Précédent
            </button>
            <button className="px-3 py-1 text-sm bg-[#C89B3C] text-white rounded hover:bg-[#b8892f]">
              1
            </button>
            <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}