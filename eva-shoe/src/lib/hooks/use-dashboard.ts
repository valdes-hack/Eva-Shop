// src/lib/hooks/use-dashboard.ts
'use client'

import { useState, useEffect } from 'react'
import { 
  getDashboardStats, 
  getChartData, 
  getTopProducts, 
  getRecentOrders, 
  getRecentActivity 
} from '@/lib/services/dashboard.service'
import type { 
  DashboardStats, 
  ChartDataPoint, 
  TopProduct, 
  RecentOrder, 
  ActivityItem,
  DashboardFilters 
} from '@/lib/types/dashboard.types'

interface UseDashboardReturn {
  stats: DashboardStats | null
  chartData: ChartDataPoint[]
  topProducts: TopProduct[]
  recentOrders: RecentOrder[]
  recentActivity: ActivityItem[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboard(filters?: DashboardFilters): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [
        statsData,
        chartResponse,
        topProductsData,
        recentOrdersData,
        recentActivityData
      ] = await Promise.all([
        getDashboardStats(filters),
        getChartData(filters),
        getTopProducts(5),
        getRecentOrders(5),
        getRecentActivity(10)
      ])

      setStats(statsData)
      setChartData(chartResponse)
      setTopProducts(topProductsData)
      setRecentOrders(recentOrdersData)
      setRecentActivity(recentActivityData)

    } catch (err) {
      console.error('Erreur lors du chargement des données dashboard:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filters])

  return {
    stats,
    chartData,
    topProducts,
    recentOrders,
    recentActivity,
    isLoading,
    error,
    refetch: fetchData
  }
}