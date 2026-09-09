// src/components/dashboard/dashboard-sidebar.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { UserProfile } from '@/lib/types/auth.types'

interface DashboardSidebarProps {
  profile: UserProfile | null
  isMobileOpen?: boolean
  isCollapsed?: boolean
  onCloseMobile?: () => void
  onToggleCollapse?: () => void
}

export default function DashboardSidebar({ 
  profile, 
  isMobileOpen = false, 
  isCollapsed = false,
  onCloseMobile,
  onToggleCollapse
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [sidebarWidth, setSidebarWidth] = useState<number>(256)
  const [isResizing, setIsResizing] = useState(false)

  // Load initial width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebar_custom_width')
    if (savedWidth) {
      setSidebarWidth(Number(savedWidth))
    }
  }, [])

  // Sync width when collapse state changes externally
  useEffect(() => {
    if (isCollapsed) {
      setSidebarWidth(80)
    } else {
      const savedWidth = localStorage.getItem('sidebar_custom_width')
      setSidebarWidth(savedWidth ? Math.max(180, Number(savedWidth)) : 256)
    }
  }, [isCollapsed])

  // Drag to resize handler
  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    const stopResizing = () => {
      setIsResizing(false)
    }

    const resize = (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX
        if (newWidth >= 70 && newWidth <= 420) {
          setSidebarWidth(newWidth)
          localStorage.setItem('sidebar_custom_width', String(newWidth))

          if (newWidth < 140) {
            if (!isCollapsed && onToggleCollapse) onToggleCollapse()
          } else {
            if (isCollapsed && onToggleCollapse) onToggleCollapse()
          }
        }
      }
    }

    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, isCollapsed, onToggleCollapse])

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      current: pathname === '/dashboard' 
    },
    { 
      name: 'Commandes', 
      href: '/commandes', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      current: pathname.startsWith('/commandes'),
      badge: '12'
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
      icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
      current: pathname.startsWith('/stocks')
    },
    { 
      name: 'Clients', 
      href: '/clients', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      current: pathname.startsWith('/clients')
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
      name: 'Paramètres', 
      href: '/parametres', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      current: pathname.startsWith('/parametres')
    },
  ]

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile()
    }
  }

  const isCompact = isCollapsed || sidebarWidth < 140

  // Common inner sidebar content
  const renderSidebarContent = (compact: boolean, isMobile: boolean) => (
    <div className="flex flex-col h-full bg-[#18181B] text-gray-200 select-none">
      {/* Header Logo & Collapse Toggle */}
      <div className={`p-4 border-b border-gray-800/80 flex items-center ${compact ? 'justify-center' : 'justify-between'} flex-shrink-0`}>
        <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C89B3C] rounded-xl flex items-center justify-center font-extrabold text-black text-xl shadow-md flex-shrink-0">
            E
          </div>
          {!compact && (
            <div className="overflow-hidden whitespace-nowrap transition-all duration-300">
              <div className="font-bold text-lg leading-none tracking-wide text-white">
                EVA <span className="text-[#C89B3C]">SHOE</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Marketplace Admin
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Collapse / Expand Toggle Button */}
        {!isMobile && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            title={compact ? "Afficher le menu complet" : "Réduire aux icônes seules"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {compact ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        )}

        {/* Mobile Close button */}
        {isMobile && onCloseMobile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCloseMobile()
            }}
            className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Fermer le menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Seller Badge Card */}
      {!compact && (
        <div className="p-3 mx-3 mt-3 bg-gray-900/80 border border-gray-800 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-full border-2 border-[#C89B3C] bg-gradient-to-tr from-amber-900 to-amber-700 flex items-center justify-center font-bold text-amber-200 text-sm flex-shrink-0 shadow-inner">
            EVA
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">Eva Store</h4>
            <div className="mt-0.5 inline-flex items-center gap-1 bg-[#C89B3C]/15 border border-[#C89B3C]/40 text-[#C89B3C] text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span>👑</span>
              <span>Vendeur vérifié</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1 scrollbar-thin">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={handleLinkClick}
            title={compact ? item.name : undefined}
            className={`
              flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative
              ${compact ? 'justify-center' : ''}
              ${item.current 
                ? 'bg-[#C89B3C] text-black font-bold shadow-md shadow-[#C89B3C]/20' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/80'
              }
            `}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
            </svg>
            
            {!compact && (
              <span className="flex-1 truncate">{item.name}</span>
            )}
            
            {!compact && item.badge && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.current ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
                {item.badge}
              </span>
            )}

            {/* Tooltip on hover when collapsed */}
            {compact && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-gray-900 text-white text-xs font-bold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 hidden md:block">
                {item.name}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Support section */}
      <div className="p-3 border-t border-gray-800/80 flex-shrink-0 bg-gray-900/60">
        {!compact ? (
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-200">
              <span className="text-base">🎧</span>
              <span>Besoin d'aide ?</span>
            </div>
            <p className="text-[11px] text-gray-400">Support client 24/7 pour vos commandes</p>
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full inline-flex items-center justify-center gap-2 bg-[#C89B3C] hover:bg-[#b8892f] text-black font-bold text-xs py-2 px-3 rounded-lg transition-colors shadow-xs"
            >
              <span>💬</span>
              <span>Contacter le support</span>
            </a>
          </div>
        ) : (
          <button 
            type="button"
            onClick={onToggleCollapse}
            className="w-full flex justify-center py-2 text-gray-400 hover:text-white transition-colors"
            title="Agrandir la barre latérale"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Side-by-side flex item, sticky top-0, resizable width) */}
      <aside 
        style={{ width: `${isCompact ? 80 : sidebarWidth}px` }}
        className={`
          hidden md:flex flex-col h-screen sticky top-0 bg-[#18181B] text-white flex-shrink-0 z-30 shadow-xl border-r border-gray-800/60 relative group
          ${isResizing ? 'transition-none' : 'transition-all duration-200 ease-in-out'}
        `}
      >
        {renderSidebarContent(isCompact, false)}

        {/* Drag Resize Handle on Desktop Right Edge */}
        <div
          onMouseDown={startResizing}
          className={`hidden md:block absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-[#C89B3C]/80 transition-colors z-40 ${
            isResizing ? 'bg-[#C89B3C]' : 'bg-transparent'
          }`}
          title="Faites glisser avec votre curseur pour étirer la barre latérale"
        >
          <div className="absolute top-1/2 right-0.5 transform -translate-y-1/2 w-1 h-8 bg-gray-600 rounded-full group-hover:bg-[#C89B3C] transition-colors"></div>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER SIDEBAR (Fixed overlay drawer, mobile only) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`
          md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#18181B] text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {renderSidebarContent(false, true)}
      </aside>
    </>
  )
}