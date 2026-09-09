// src/app/(dashboard)/categories/gestion-complete/page.tsx
'use client'

import { useState, useCallback } from 'react'
import CategoryHierarchyView from '@/components/dashboard/categories/category-hierarchy-view'
import CategoryAttributesManager from '@/components/dashboard/categories/category-attributes-manager'
import CategoryFormExtended from '@/components/dashboard/categories/category-form-extended'
import type { Category } from '@/lib/types/category.types'

export default function CategoriesGestionComplete() {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'attributes' | 'form'>('hierarchy')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category)
    if (activeTab === 'hierarchy') {
      setActiveTab('attributes')
    }
  }, [activeTab])

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  const tabs = [
    {
      key: 'hierarchy' as const,
      label: 'Hiérarchie',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      key: 'attributes' as const,
      label: 'Attributs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      disabled: !selectedCategory
    },
    {
      key: 'form' as const,
      label: 'Nouvelle catégorie',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header avec breadcrumb */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>Tableau de bord</span>
          <span>›</span>
          <span>Catégories</span>
          <span>›</span>
          <span className="text-gray-900 font-bold">Gestion complète</span>
        </nav>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Gestion complète des catégories
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Gérez l'arborescence, les attributs et les propriétés de vos catégories
            </p>
          </div>
          
          {selectedCategory && (
            <div className="bg-[#C89B3C]/10 border border-[#C89B3C]/30 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#C89B3C]">Catégorie sélectionnée:</span>
                <span className="font-bold text-[#C89B3C]">{selectedCategory.name}</span>
                {selectedCategory.hierarchy_path && (
                  <span className="text-xs text-[#C89B3C]/70">
                    ({selectedCategory.hierarchy_path})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => !tab.disabled && setActiveTab(tab.key)}
                disabled={tab.disabled}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#C89B3C] text-[#C89B3C]'
                    : tab.disabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.disabled && (
                  <span className="text-xs text-gray-400">(sélectionnez une catégorie)</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'hierarchy' && (
            <CategoryHierarchyView
              onCategorySelect={handleCategorySelect}
              onCategoryUpdate={handleRefresh}
              selectedCategoryId={selectedCategory?.id}
            />
          )}

          {activeTab === 'attributes' && selectedCategory && (
            <CategoryAttributesManager
              categoryId={selectedCategory.id}
              categoryName={selectedCategory.name}
              onAttributeChange={handleRefresh}
            />
          )}

          {activeTab === 'form' && (
            <CategoryFormExtended
              onSuccess={(category) => {
                setSelectedCategory(category)
                setActiveTab('hierarchy')
                handleRefresh()
              }}
              onCancel={() => setActiveTab('hierarchy')}
            />
          )}
        </div>
      </div>

      {/* Statistiques rapides */}
      {selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sous-catégories</p>
                <p className="text-xl font-bold text-gray-900">{selectedCategory.children?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Produits</p>
                <p className="text-xl font-bold text-gray-900">{selectedCategory.products_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Attributs</p>
                <p className="text-xl font-bold text-gray-900">{selectedCategory.attributes?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedCategory.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                <svg className={`w-5 h-5 ${selectedCategory.is_active ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={selectedCategory.is_active ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <p className={`text-xl font-bold ${selectedCategory.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedCategory.is_active ? 'Active' : 'Masquée'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}