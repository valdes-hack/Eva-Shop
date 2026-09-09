// src/components/dashboard/common/breadcrumb.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
  color?: string // Pour mettre en évidence certains liens
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const router = useRouter()

  return (
    <nav className={`flex items-center gap-2 text-xs text-gray-500 mb-2 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href && !item.isActive ? (
            <Link 
              href={item.href}
              className={`hover:text-gray-900 transition-colors ${
                item.color === 'primary' ? 'text-[#C89B3C] font-medium' : ''
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.isActive ? 'text-gray-900 font-bold' : ''}>
              {item.label}
            </span>
          )}
          
          {index < items.length - 1 && (
            <span className="text-gray-400">›</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Hook pour créer facilement des breadcrumbs standards
export function useDashboardBreadcrumb() {
  return {
    // Breadcrumb standard pour le dashboard
    dashboard: (): BreadcrumbItem => ({
      label: 'Tableau de bord',
      href: '/dashboard'
    }),

    // Breadcrumbs pour les catégories
    categories: (): BreadcrumbItem => ({
      label: 'Catégories', 
      href: '/categories'
    }),

    categoriesAttributes: (): BreadcrumbItem => ({
      label: 'Attributs',
      href: '/categories/attributs',
      color: 'primary'
    }),

    categoriesAdd: (): BreadcrumbItem => ({
      label: 'Ajouter',
      isActive: true
    }),

    categoriesEdit: (categoryName?: string): BreadcrumbItem => ({
      label: categoryName ? `Modifier "${categoryName}"` : 'Modifier',
      isActive: true
    }),

    // Breadcrumbs pour les produits
    products: (): BreadcrumbItem => ({
      label: 'Produits',
      href: '/produits'
    }),

    productsAdd: (): BreadcrumbItem => ({
      label: 'Ajouter',
      isActive: true
    }),

    productsEdit: (productName?: string): BreadcrumbItem => ({
      label: productName ? `Modifier "${productName}"` : 'Modifier',
      isActive: true
    }),

    // Breadcrumbs pour les commandes
    orders: (): BreadcrumbItem => ({
      label: 'Commandes',
      href: '/commandes'
    }),

    ordersView: (orderNumber?: string): BreadcrumbItem => ({
      label: orderNumber ? `Commande #${orderNumber}` : 'Détails',
      isActive: true
    }),

    // Breadcrumbs pour les clients
    clients: (): BreadcrumbItem => ({
      label: 'Clients',
      href: '/clients'
    }),

    clientsView: (clientName?: string): BreadcrumbItem => ({
      label: clientName ? `Client ${clientName}` : 'Profil',
      isActive: true
    }),

    // Breadcrumbs pour les paramètres
    settings: (): BreadcrumbItem => ({
      label: 'Paramètres',
      href: '/parametres'
    }),

    settingsSection: (sectionName: string): BreadcrumbItem => ({
      label: sectionName,
      isActive: true
    }),

    // Breadcrumbs pour les statistiques
    stats: (): BreadcrumbItem => ({
      label: 'Statistiques',
      href: '/statistiques'
    }),

    // Breadcrumbs pour les promotions
    promotions: (): BreadcrumbItem => ({
      label: 'Promotions',
      href: '/promotions'
    })
  }
}