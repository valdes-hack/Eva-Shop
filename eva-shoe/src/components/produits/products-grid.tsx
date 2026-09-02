// src/components/produits/products-grid.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types/product.types'
import LoadingSpinner from '@/components/ui/loading-spinner'

interface ProductsGridProps {
  products: Product[]
  isLoading?: boolean
  error?: string | null
}

export default function ProductsGrid({ products, isLoading = false, error }: ProductsGridProps) {
  const [sortBy, setSortBy] = useState('name')

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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Aucun produit trouvé dans cette catégorie</div>
        <Link 
          href="/produits"
          className="text-[#C89B3C] hover:text-[#b8892f] font-medium"
        >
          Voir tous les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec tri */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {products.length} produit{products.length > 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          >
            <option value="name">Nom</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="newest">Plus récent</option>
            <option value="popular">Popularité</option>
          </select>
        </div>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id}
            href={`/produits/${product.slug}`}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image du produit */}
            <div className="relative h-64 bg-gray-100 overflow-hidden">
              {product.images && product.images[0] ? (
                <Image
                  src={product.images[0].image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.is_featured && (
                  <span className="bg-[#C89B3C] text-white px-2 py-1 rounded-full text-xs font-medium">
                    ⭐ Vedette
                  </span>
                )}
                {product.sale_price && product.sale_price < product.price && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Informations du produit */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-medium text-gray-900 group-hover:text-[#C89B3C] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                {product.brand && (
                  <p className="text-sm text-gray-500">{product.brand}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.sale_price && product.sale_price < product.price ? (
                    <>
                      <span className="font-semibold text-[#C89B3C]">
                        {product.sale_price.toLocaleString()} FCFA
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.price.toLocaleString()} FCFA
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      {product.price.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
                
                <button className="opacity-0 group-hover:opacity-100 bg-[#C89B3C] text-white p-2 rounded-full hover:bg-[#b8892f] transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10.5" />
                  </svg>
                </button>
              </div>
              
              {/* Tailles disponibles */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {[...new Set(product.variants.map(v => v.size))].slice(0, 4).map((size) => (
                    <span key={size} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {size}
                    </span>
                  ))}
                  {[...new Set(product.variants.map(v => v.size))].length > 4 && (
                    <span className="text-xs text-gray-500">+{[...new Set(product.variants.map(v => v.size))].length - 4}</span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination (placeholder) */}
      <div className="flex items-center justify-center mt-12">
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Précédent
          </button>
          <button className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}