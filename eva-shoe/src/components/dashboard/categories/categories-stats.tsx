// src/components/dashboard/categories/categories-stats.tsx
'use client'

import { useState, useEffect } from 'react'
import { getCategoriesStats } from '@/lib/services/category-optimized.service'

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
      subtitle: 'Toutes les catégories créées',
      icon: (
        <svg className="w-6 h-6 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      bgColor: 'bg-[#FFF8EC]',
      borderColor: 'border-[#FCE7D0]',
      textColor: 'text-amber-900'
    },
    {
      title: 'Catégories actives',
      value: stats.active.toString(),
      subtitle: 'Visibles en ligne sur la boutique',
      icon: (
        <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-[#EAF8F1]',
      borderColor: 'border-[#D1F2DF]',
      textColor: 'text-emerald-900'
    },
    {
      title: 'Catégories masquées',
      value: stats.hidden.toString(),
      subtitle: 'Inactives ou en brouillon',
      icon: (
        <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.046 10.046 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
        </svg>
      ),
      bgColor: 'bg-[#FDEAEA]',
      borderColor: 'border-[#FCD4D4]',
      textColor: 'text-rose-900'
    },
    {
      title: 'Sous-catégories',
      value: stats.subcategories.toString(),
      subtitle: 'Liées à une catégorie parente',
      icon: (
        <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      bgColor: 'bg-[#EEF4FF]',
      borderColor: 'border-[#DBEAFE]',
      textColor: 'text-blue-900'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card, index) => (
        <div 
          key={index} 
          className={`bg-white p-5 rounded-xl border ${card.borderColor} shadow-xs hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs`}>
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 truncate">{card.title}</p>
              <p className={`text-2xl font-extrabold ${card.textColor} tracking-tight my-0.5`}>
                {card.value}
              </p>
              <p className="text-[11px] text-gray-400 truncate">{card.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
