// src/components/dashboard/best-products.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface BestProduct {
  id: string
  name: string
  image: string
  sales: number
  revenue: number
  growth: number
  category: string
}

export default function BestProducts() {
  const [products, setProducts] = useState<BestProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch real data from API
    // Mock data for now
    const mockProducts: BestProduct[] = [
      {
        id: '1',
        name: 'Sneakers Air Max Classic',
        image: '/images/hero-shoes.png',
        sales: 145,
        revenue: 21750,
        growth: 15.2,
        category: 'Sneakers'
      },
      {
        id: '2',
        name: 'Chaussures Femme Élégantes',
        image: '/images/cat-femme.png',
        sales: 98,
        revenue: 19600,
        growth: 8.5,
        category: 'Femme'
      },
      {
        id: '3',
        name: 'Boots Homme Cuir',
        image: '/images/cat-homme.png',
        sales: 87,
        revenue: 17400,
        growth: -2.1,
        category: 'Homme'
      },
      {
        id: '4',
        name: 'Baskets Enfant Colorées',
        image: '/images/cat-enfant.png',
        sales: 76,
        revenue: 11400,
        growth: 22.3,
        category: 'Enfant'
      },
      {
        id: '5',
        name: 'Sac à Main Premium',
        image: '/images/cat-accessoires.png',
        sales: 54,
        revenue: 16200,
        growth: 5.7,
        category: 'Accessoires'
      }
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 500)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Meilleurs produits</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meilleurs produits</h3>
          <p className="text-sm text-gray-500">Classés par nombre de ventes</p>
        </div>
        <button className="text-sm text-[#C89B3C] hover:text-[#b8892f] font-medium">
          Voir tout
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            {/* Rank */}
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index === 0 ? 'bg-yellow-100 text-yellow-800' :
              index === 1 ? 'bg-gray-100 text-gray-700' :
              index === 2 ? 'bg-orange-100 text-orange-800' :
              'bg-gray-50 text-gray-600'
            }`}>
              {index + 1}
            </div>

            {/* Product Image */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
                <span className="text-xs text-gray-500">{product.sales} ventes</span>
              </div>
            </div>

            {/* Sales Data */}
            <div className="text-right flex-shrink-0">
              <div className="font-semibold text-gray-900">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XAF',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(product.revenue)}
              </div>
              <div className={`text-xs font-medium ${
                product.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.growth >= 0 ? '+' : ''}{product.growth.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {products.reduce((sum, p) => sum + p.sales, 0)}
            </div>
            <div className="text-xs text-gray-500">Ventes totales</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {new Intl.NumberFormat('fr-FR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(products.reduce((sum, p) => sum + p.revenue, 0))}
            </div>
            <div className="text-xs text-gray-500">Revenus (FCFA)</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              +{(products.reduce((sum, p) => sum + p.growth, 0) / products.length).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Croissance moy.</div>
          </div>
        </div>
      </div>
    </div>
  )
}