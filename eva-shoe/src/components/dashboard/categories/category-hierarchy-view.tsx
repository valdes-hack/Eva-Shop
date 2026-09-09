// src/components/dashboard/categories/category-hierarchy-view.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategoryHierarchy, moveCategory, duplicateCategory } from '@/lib/services/category-optimized.service'
import type { Category } from '@/lib/types/category.types'

interface CategoryHierarchyViewProps {
  onCategorySelect?: (category: Category) => void
  onCategoryUpdate?: () => void
  selectedCategoryId?: string
}

export default function CategoryHierarchyView({ 
  onCategorySelect, 
  onCategoryUpdate,
  selectedCategoryId 
}: CategoryHierarchyViewProps) {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadHierarchy()
  }, [])

  const loadHierarchy = async () => {
    try {
      setLoading(true)
      const hierarchy = await getCategoryHierarchy()
      setCategories(hierarchy)
      
      // Expand root categories by default
      const rootIds = new Set(hierarchy.map(cat => cat.id))
      setExpandedIds(rootIds)
    } catch (error) {
      console.error('Erreur lors du chargement de la hiérarchie:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedIds(newExpanded)
  }

  const handleCategoryMove = async (categoryId: string, newParentId: string | null) => {
    try {
      await moveCategory(categoryId, newParentId)
      await loadHierarchy()
      if (onCategoryUpdate) {
        onCategoryUpdate()
      }
    } catch (error) {
      console.error('Erreur lors du déplacement:', error)
      alert('Impossible de déplacer la catégorie')
    }
  }

  const handleCategoryDuplicate = async (category: Category) => {
    const newName = prompt('Nom de la nouvelle catégorie:', `${category.name} (Copie)`)
    if (!newName) return

    try {
      await duplicateCategory(category.id, newName)
      await loadHierarchy()
      if (onCategoryUpdate) {
        onCategoryUpdate()
      }
    } catch (error) {
      console.error('Erreur lors de la duplication:', error)
      alert('Impossible de dupliquer la catégorie')
    }
  }

  const getCategoryIcon = (category: Category) => {
    if (category.icon) {
      const iconMap: { [key: string]: string } = {
        'folder': '📁',
        'shoe': '👟',
        'shirt': '👕',
        'bag': '👜',
        'watch': '⌚',
        'glasses': '👓',
        'cap': '🧢',
        'belt': '👔',
        'jewelry': '💍',
        'star': '⭐'
      }
      return iconMap[category.icon] || '📁'
    }
    return category.children && category.children.length > 0 ? '📁' : '📄'
  }

  const renderCategory = (category: Category, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedIds.has(category.id)
    const isSelected = selectedCategoryId === category.id

    return (
      <div key={category.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-[#C89B3C] text-white' 
              : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => onCategorySelect && onCategorySelect(category)}
          draggable
          onDragStart={() => setDraggedCategory(category.id)}
          onDragEnd={() => setDraggedCategory(null)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            if (draggedCategory && draggedCategory !== category.id) {
              handleCategoryMove(draggedCategory, category.id)
            }
          }}
        >
          {/* Expand/Collapse button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(category.id)
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="w-6 h-6"></div>
          )}

          {/* Category icon */}
          <span className="text-lg">{getCategoryIcon(category)}</span>

          {/* Category name and info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{category.name}</span>
              {!category.is_active && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  Masquée
                </span>
              )}
              {category.is_featured && (
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  ⭐
                </span>
              )}
            </div>
            {category.hierarchy_path && (
              <div className="text-xs text-gray-500 truncate">
                {category.hierarchy_path}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/categories/modifier/${category.id}`}
              className="p-1 text-gray-500 hover:text-[#C89B3C] transition-colors"
              title="Modifier"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCategoryDuplicate(category)
              }}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              title="Dupliquer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {category.children!.map(child => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Hiérarchie des catégories
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Organisez vos catégories par glisser-déposer
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadHierarchy}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Actualiser"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <Link
            href="/categories/ajouter"
            className="px-3 py-1 text-sm bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] transition-colors"
          >
            + Ajouter
          </Link>
        </div>
      </div>

      {/* Tree */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">Aucune catégorie</p>
            <p className="text-gray-500 mt-1">Commencez par créer votre première catégorie</p>
          </div>
        ) : (
          <div className="space-y-1 group">
            {categories.map(category => renderCategory(category))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Glissez-déposez pour réorganiser • Cliquez sur une catégorie pour la sélectionner
        </div>
      </div>
    </div>
  )
}