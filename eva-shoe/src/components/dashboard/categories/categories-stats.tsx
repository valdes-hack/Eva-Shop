// src/components/dashboard/categories/categories-stats.tsx
'use client'

import { useState, useEffect } from 'react'
import { getCategoriesStats } from '@/lib/services/category.service'

interface CategoryStats {
  total: number
  active: number
  hidden: number
  subcategories: number
}

export default function CategoriesStats() {
  const [stats, setStats] = useState<CategoryStats>({
    total: 0,
    active: 0,
    hidden: 0,
    subcategories: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getCategoriesStats()
      setStats(data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: 'Total catégories',
      value: stats.total.toString(),
      subtitle: 'Catégories actives',
      icon: '📁',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Catégories actives',
      value: stats.active.toString(),
      subtitle: 'Affichées sur la boutique',
      icon: '📊',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Catégories masquées',
      value: stats.hidden.toString(),
      subtitle: 'Non visibles sur la boutique',
      icon: '👁‍🗨',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Sous-catégories',
      value: stats.subcategories.toString(),
      subtitle: 'Dans toutes les catégories',
      icon: '🔢',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor} mb-1`}>{card.value}</p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}