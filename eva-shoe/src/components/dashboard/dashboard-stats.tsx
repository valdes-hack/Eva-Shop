// src/components/dashboard/dashboard-stats.tsx
'use client'

import { useDashboard } from '@/lib/hooks/use-dashboard'
import StatCard from '@/components/ui/stat-card'

interface DashboardStatsProps {
  className?: string
}

export default function DashboardStats({ className = '' }: DashboardStatsProps) {
  const { stats, isLoading, error } = useDashboard()

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-700 text-sm">Erreur: {error}</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Ventes totales',
      value: stats ? `${(stats.totalRevenue / 1000).toFixed(0)}k FCFA` : '...',
      change: stats?.revenueChange,
      changeLabel: 'vs mois dernier',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      bgColor: 'bg-green-500'
    },
    {
      title: 'Commandes',
      value: stats?.totalOrders || '...',
      change: stats?.ordersChange,
      changeLabel: 'vs mois dernier',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Produits vendus',
      value: stats?.totalProducts || '...',
      change: stats?.productsChange,
      changeLabel: 'vs mois dernier',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Panier moyen',
      value: stats ? `${(stats.avgOrderValue / 1000).toFixed(0)}k FCFA` : '...',
      change: stats?.customersChange,
      changeLabel: 'vs mois dernier',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      bgColor: 'bg-[#C89B3C]'
    }
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          changeLabel={card.changeLabel}
          icon={card.icon}
          bgColor={card.bgColor}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}