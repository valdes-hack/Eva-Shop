// src/app/(dashboard)/categories/attributs/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Breadcrumb, { useDashboardBreadcrumb } from '@/components/dashboard/common/breadcrumb'
import { 
  getAttributeTypes,
  getAttributeStats,
  createAttributeType,
  updateAttributeType,
  deleteAttributeType 
} from '@/lib/services/attribute.service'
import type { 
  AttributeTypeDefinition, 
  AttributeTypeFormData, 
  AttributeStats,
  AttributeFilters 
} from '@/lib/types/attribute.types'

export default function AttributsPage() {
  const router = useRouter()
  const breadcrumb = useDashboardBreadcrumb()
  const [attributes, setAttributes] = useState<AttributeTypeDefinition[]>([])
  const [stats, setStats] = useState<AttributeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const breadcrumbItems = [
    breadcrumb.dashboard(),
    breadcrumb.categories(),
    { label: 'Gestion des attributs', isActive: true }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [attributesResult, statsResult] = await Promise.all([
        getAttributeTypes({ is_active: true }),
        getAttributeStats()
      ])
      
      setAttributes(attributesResult.data)
      setStats(statsResult)
      
    } catch (error) {
      console.error('Erreur lors du chargement des attributs:', error)
      setError('Impossible de charger les données')
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow animate-pulse p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des attributs</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f]"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des attributs</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Configurez les propriétés que vos produits peuvent avoir (couleur, taille, marque, etc.)
            </p>
          </div>
          
          <button className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvel attribut
          </button>
        </div>
      </div>
      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Types d'attributs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_types}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Catégories configurées</p>
            <p className="text-2xl font-bold text-gray-900">{stats.categories_with_attributes}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Type le plus utilisé</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.most_used[0]?.name || 'Aucun'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Types par format</p>
            <p className="text-2xl font-bold text-gray-900">
              {Object.keys(stats.by_type).length} formats
            </p>
          </div>
        </div>
      )}

      {/* Liste des attributs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Attributs configurés</h2>
          <p className="text-sm text-gray-600">
            Les attributs système sont créés automatiquement et configurés par type de catégorie
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {attributes.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">Aucun attribut configuré</p>
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-green-600 font-medium">
              🎉 {attributes.length} attributs configurés et prêts à l'emploi !
            </div>
          )}
        </div>
      </div>
    </div>
  )
}