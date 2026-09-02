// src/components/dashboard/recent-orders.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  itemsCount: number
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch real data from API
    // Mock data for now
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'EVA-2026-001234',
        customerName: 'Marie Dubois',
        customerEmail: 'marie.dubois@email.com',
        totalAmount: 89500,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
        itemsCount: 2
      },
      {
        id: '2',
        orderNumber: 'EVA-2026-001235',
        customerName: 'Jean Martin',
        customerEmail: 'jean.martin@email.com',
        totalAmount: 156000,
        status: 'preparing',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        itemsCount: 3
      },
      {
        id: '3',
        orderNumber: 'EVA-2026-001236',
        customerName: 'Sophie Laurent',
        customerEmail: 'sophie.laurent@email.com',
        totalAmount: 72000,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        itemsCount: 1
      },
      {
        id: '4',
        orderNumber: 'EVA-2026-001237',
        customerName: 'Paul Durand',
        customerEmail: 'paul.durand@email.com',
        totalAmount: 234000,
        status: 'shipped',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        itemsCount: 4
      },
      {
        id: '5',
        orderNumber: 'EVA-2026-001238',
        customerName: 'Alice Bernard',
        customerEmail: 'alice.bernard@email.com',
        totalAmount: 98000,
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 21600000).toISOString(),
        itemsCount: 2
      }
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 500)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-orange-100 text-orange-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'confirmed': return 'Confirmée'
      case 'preparing': return 'Préparation'
      case 'shipped': return 'Expédiée'
      case 'delivered': return 'Livrée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Payé'
      case 'pending': return 'En attente'
      case 'failed': return 'Échec'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return 'À l\'instant'
    if (diffMinutes < 60) return `Il y a ${diffMinutes}min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
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
          <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
          <p className="text-sm text-gray-500">Dernières commandes reçues</p>
        </div>
        <Link
          href="/dashboard/commandes"
          className="text-sm text-[#C89B3C] hover:text-[#b8892f] font-medium"
        >
          Voir toutes
        </Link>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/dashboard/commandes/${order.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">
                    {order.orderNumber}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{order.customerName}</span>
                  <span>•</span>
                  <span>{order.itemsCount} article{order.itemsCount > 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span className={getPaymentStatusColor(order.paymentStatus)}>
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-4">
                <div className="font-semibold text-gray-900">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XAF',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(order.totalAmount)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-500">En attente</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {orders.filter(o => ['confirmed', 'preparing'].includes(o.status)).length}
            </div>
            <div className="text-xs text-gray-500">À traiter</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-xs text-gray-500">Livrées</div>
          </div>
        </div>
      </div>
    </div>
  )
}