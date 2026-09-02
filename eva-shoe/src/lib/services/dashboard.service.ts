// src/lib/services/dashboard.service.ts
import { createClient } from '@/lib/supabase/client'
import type { 
  DashboardStats, 
  ChartDataPoint, 
  TopProduct, 
  RecentOrder, 
  ActivityItem,
  DashboardFilters 
} from '@/lib/types/dashboard.types'

const supabase = createClient()

// =====================================================
// STATISTIQUES GÉNÉRALES
// =====================================================
export async function getDashboardStats(filters?: DashboardFilters): Promise<DashboardStats> {
  try {
    // TODO: Implémenter les vraies requêtes SQL
    // Pour l'instant, retourner des données mockées
    return {
      totalRevenue: 2450000,
      revenueChange: 15.2,
      totalOrders: 128,
      ordersChange: 8.4,
      totalProducts: 246,
      productsChange: 2.1,
      totalCustomers: 19140,
      customersChange: 12.7,
      pendingOrders: 12,
      lowStockProducts: 8,
      conversionRate: 4.6,
      avgOrderValue: 147250
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    throw new Error('Impossible de charger les statistiques')
  }
}

// =====================================================
// DONNÉES GRAPHIQUES
// =====================================================
export async function getChartData(filters?: DashboardFilters): Promise<ChartDataPoint[]> {
  try {
    // TODO: Requêtes SQL réelles basées sur les filtres
    const mockData: ChartDataPoint[] = [
      { period: 'Lun', orders: 25, revenue: 3750000 },
      { period: 'Mar', orders: 32, revenue: 4800000 },
      { period: 'Mer', orders: 18, revenue: 2700000 },
      { period: 'Jeu', orders: 45, revenue: 6750000 },
      { period: 'Ven', orders: 52, revenue: 7800000 },
      { period: 'Sam', orders: 38, revenue: 5700000 },
      { period: 'Dim', orders: 28, revenue: 4200000 }
    ]
    
    return mockData
  } catch (error) {
    console.error('Erreur lors de la récupération des données graphiques:', error)
    throw new Error('Impossible de charger les données graphiques')
  }
}

// =====================================================
// MEILLEURS PRODUITS
// =====================================================
export async function getTopProducts(limit: number = 5): Promise<TopProduct[]> {
  try {
    // TODO: Requête SQL avec jointures products + order_items
    const mockData: TopProduct[] = [
      {
        id: '1',
        name: 'Sneakers Air Max Classic',
        image: '/images/hero-shoes.png',
        sales: 42,
        revenue: 378000,
        growth: 15.2,
        category: 'Sneakers'
      },
      {
        id: '2', 
        name: 'Sac à Main Élégant',
        image: '/images/cat-accessoires.png',
        sales: 31,
        revenue: 289000,
        growth: 8.7,
        category: 'Accessoires'
      }
    ]
    
    return mockData.slice(0, limit)
  } catch (error) {
    console.error('Erreur lors de la récupération des meilleurs produits:', error)
    throw new Error('Impossible de charger les meilleurs produits')
  }
}

// =====================================================
// COMMANDES RÉCENTES
// =====================================================
export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
  try {
    // TODO: Requête SQL sur la table orders
    const mockData: RecentOrder[] = [
      {
        id: '1',
        orderNumber: 'EVA-2026-1387',
        customerName: 'Marie K.',
        customerEmail: 'marie.k@email.com',
        totalAmount: 28900,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
        itemsCount: 1
      }
    ]
    
    return mockData.slice(0, limit)
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes récentes:', error)
    throw new Error('Impossible de charger les commandes récentes')
  }
}

// =====================================================
// ACTIVITÉ RÉCENTE
// =====================================================
export async function getRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
  try {
    // TODO: Système de logs d'activité
    const mockData: ActivityItem[] = [
      {
        id: '1',
        type: 'order',
        title: 'Nouvelle commande',
        description: 'Commande EVA-2026-1387',
        timestamp: new Date().toISOString(),
        user: 'Marie K.'
      }
    ]
    
    return mockData.slice(0, limit)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité récente:', error)
    throw new Error('Impossible de charger l\'activité récente')
  }
}