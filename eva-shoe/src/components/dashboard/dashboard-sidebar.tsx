// src/components/dashboard/dashboard-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { UserProfile } from '@/lib/types/auth.types'

interface DashboardSidebarProps {
  profile: UserProfile | null
}

export default function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10l2-2v-8h14v8H3z',
      current: pathname === '/dashboard' 
    },
    { 
      name: 'Commandes', 
      href: '/commandes', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      current: pathname.startsWith('/commandes'),
      badge: '15'
    },
    { 
      name: 'Produits', 
      href: '/produits', 
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      current: pathname.startsWith('/produits')
    },
    { 
      name: 'Catégories', 
      href: '/categories', 
      icon: 'M4 6h16M4 12h16M4 18h16',
      current: pathname.startsWith('/categories')
    },
    { 
      name: 'Stock', 
      href: '/stocks', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      current: pathname.startsWith('/stocks')
    },
    { 
      name: 'Clients', 
      href: '/clients', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      current: pathname.startsWith('/clients')
    },
    { 
      name: 'Finances', 
      href: '/finances', 
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      current: pathname.startsWith('/finances')
    },
    { 
      name: 'Statistiques', 
      href: '/statistiques', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      current: pathname.startsWith('/statistiques')
    },
    { 
      name: 'Promotions', 
      href: '/promotions', 
      icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      current: pathname.startsWith('/promotions')
    },
    { 
      name: 'Avis & Retours', 
      href: '/avis', 
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      current: pathname.startsWith('/avis')
    },
    { 
      name: 'Boutique', 
      href: '/boutique', 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      current: pathname.startsWith('/boutique')
    },
    { 
      name: 'Paramètres', 
      href: '/parametres', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      current: pathname.startsWith('/parametres')
    },
  ]

  return (
    <div className="w-64 bg-[#1a1a1a] text-white flex flex-col fixed left-0 top-0 h-screen overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C89B3C] rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-black" viewBox="0 0 40 40" fill="none">
              <path d="M8 28C8 28 10 22 14 20C18 18 26 18 30 14C32 12 34 8 34 8C34 8 33 18 29 23C25 28 18 29 14 29C10 29 8 28 8 28Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-lg">EVA <span className="text-[#C89B3C]">SHOE</span></div>
          </div>
        </Link>
        
        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-500">Vendeur vérifié</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto sidebar-scroll">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${item.current 
                  ? 'bg-[#C89B3C] text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Support */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-[#C89B3C] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-medium">Besoin d'aide ?</div>
            <button className="text-[#C89B3C] text-xs hover:underline">
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}