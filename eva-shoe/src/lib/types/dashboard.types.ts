 // src/lib/types/dashboard.types.ts

export interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalProducts: number
  productsChange: number
  totalCustomers: number
  customersChange: number
  pendingOrders: number
  lowStockProducts: number
  conversionRate: number
  avgOrderValue: number
}

export interface ChartDataPoint {
  period: string
  orders: number
  revenue: number
}

export interface TopProduct {
  id: string
  name: string
  image: string
  sales: number
  revenue: number
  growth: number
  category: string
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  itemsCount: number
}

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  user?: string
  metadata?: Record<string, any>
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'shipped' 
  | 'in_transit' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded' 
  | 'returned'

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded'

export type ActivityType = 
  | 'order' 
  | 'product' 
  | 'user' 
  | 'system' 
  | 'stock'

export interface DashboardFilters {
  period: '7d' | '30d' | '90d' | '1y'
  dateFrom?: string
  dateTo?: string
}