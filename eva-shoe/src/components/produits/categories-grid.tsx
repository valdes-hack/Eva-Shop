// src/components/categories/categories-grid.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/lib/services/category.service'
import type { Category } from '@/lib/types/category.types'
import LoadingSpinner from '@/components/ui/loading-spinner'

interface CategoriesGridProps {
  searchParams?: {
    search?: string
    sort?: string
    filter?: string
  }
}

export default function CategoriesGrid({ searchParams }: CategoriesGridProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true)
        setError(null)
        
        const filters = {
          search: searchParams?.search,
          is_active: true,
          sort_field: 'display_order' as const,
          sort_direction: 'asc' as const
        }
        
        const data = await getCategories(filters)
        setCategories(data)
      } catch (err) {
        setError('Erreur lors du chargement des catégories')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [searchParams])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#C89B3C] text-white px-6 py-2 rounded-lg hover:bg-[#b8892f] transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Aucune catégorie trouvée</div>
        <Link 
          href="/categories"
          className="text-[#C89B3C] hover:text-[#b8892f] font-medium"
        >
          Voir toutes les catégories
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Nos catégories ({categories.length})
          </h2>
          <p className="text-gray-600 mt-1">
            Trouvez exactement ce que vous cherchez
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="name">Nom</option>
            <option value="popular">Popularité</option>
            <option value="newest">Plus récent</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/categories/${category.slug}`}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-4xl">{category.icon || '📁'}</div>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              
              {/* Badge en vedette */}
              {category.is_featured && (
                <div className="absolute top-3 right-3 bg-[#C89B3C] text-white px-2 py-1 rounded-full text-xs font-medium">
                  ⭐ Vedette
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#C89B3C] transition-colors">
                  {category.name}
                </h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#C89B3C] transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {category.products_count} produit{category.products_count > 1 ? 's' : ''}
                </span>
                
                {category.parent_name && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {category.parent_name}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center bg-gradient-to-r from-[#C89B3C] to-[#b8892f] rounded-xl p-8 text-white">
        <h3 className="text-xl font-bold mb-2">Vous ne trouvez pas ce que vous cherchez ?</h3>
        <p className="mb-6">Contactez-nous et nous vous aiderons à trouver le produit parfait</p>
        <Link 
          href="/contact"
          className="inline-block bg-white text-[#C89B3C] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  )
}