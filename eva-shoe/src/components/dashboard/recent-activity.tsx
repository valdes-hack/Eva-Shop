// src/components/dashboard/recent-activity.tsx
'use client'

import { useState, useEffect } from 'react'

interface Activity {
  id: string
  type: 'order' | 'product' | 'user' | 'system' | 'stock'
  title: string
  description: string
  timestamp: string
  user?: string
  metadata?: any
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch real data from API
    // Mock data for now
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'order',
        title: 'Nouvelle commande',
        description: 'Commande EVA-2026-001234 de Marie Dubois',
        timestamp: new Date().toISOString(),
        user: 'Marie Dubois'
      },
      {
        id: '2',
        type: 'stock',
        title: 'Stock faible',
        description: 'Sneakers Air Max Classic - Plus que 3 unités',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        user: 'Système'
      },
      {
        id: '3',
        type: 'product',
        title: 'Produit ajouté',
        description: 'Nouveau produit "Boots Cuir Premium" créé',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: 'Admin EVA'
      },
      {
        id: '4',
        type: 'order',
        title: 'Commande expédiée',
        description: 'Commande EVA-2026-001230 envoyée à Jean Martin',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        user: 'Admin EVA'
      },
      {
        id: '5',
        type: 'user',
        title: 'Nouveau client',
        description: 'Sophie Laurent s\'est inscrite',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        user: 'Sophie Laurent'
      },
      {
        id: '6',
        type: 'system',
        title: 'Sauvegarde automatique',
        description: 'Sauvegarde des données terminée avec succès',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        user: 'Système'
      },
      {
        id: '7',
        type: 'order',
        title: 'Paiement reçu',
        description: 'Paiement de 156 000 FCFA confirmé pour la commande EVA-2026-001235',
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        user: 'Paul Durand'
      },
      {
        id: '8',
        type: 'product',
        title: 'Prix mis à jour',
        description: 'Prix de "Chaussures Femme Élégantes" modifié',
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        user: 'Admin EVA'
      }
    ]

    setTimeout(() => {
      setActivities(mockActivities)
      setIsLoading(false)
    }, 500)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
      case 'product':
        return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
      case 'user':
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      case 'stock':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      case 'system':
        return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-500'
      case 'product': return 'bg-purple-500'
      case 'user': return 'bg-green-500'
      case 'stock': return 'bg-yellow-500'
      case 'system': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'À l\'instant'
    if (diffMinutes < 60) return `${diffMinutes}min`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}j`
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
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
          <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
          <p className="text-sm text-gray-500">Dernières actions sur la plateforme</p>
        </div>
        <button className="text-sm text-[#C89B3C] hover:text-[#b8892f] font-medium">
          Tout voir
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-3">
            {/* Activity Icon */}
            <div className={`flex-shrink-0 w-8 h-8 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getActivityIcon(activity.type)} />
              </svg>
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                {activity.user && (
                  <span className="text-xs text-gray-500">• {activity.user}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
            </div>

            {/* Timestamp */}
            <div className="flex-shrink-0 text-xs text-gray-500">
              {formatTimestamp(activity.timestamp)}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm font-bold text-blue-600">
              {activities.filter(a => a.type === 'order').length}
            </div>
            <div className="text-xs text-gray-500">Commandes</div>
          </div>
          <div>
            <div className="text-sm font-bold text-purple-600">
              {activities.filter(a => a.type === 'product').length}
            </div>
            <div className="text-xs text-gray-500">Produits</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-600">
              {activities.filter(a => a.type === 'user').length}
            </div>
            <div className="text-xs text-gray-500">Utilisateurs</div>
          </div>
          <div>
            <div className="text-sm font-bold text-yellow-600">
              {activities.filter(a => a.type === 'stock').length}
            </div>
            <div className="text-xs text-gray-500">Alertes</div>
          </div>
        </div>
      </div>
    </div>
  )
}