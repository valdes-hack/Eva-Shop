// src/components/dashboard/categories/categories-data-table.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategories, deleteCategory, updateCategory } from '@/lib/services/category.service'
import type { Category } from '@/lib/types/category.types'

interface CategoriesDataTableProps {
  searchTerm?: string
  statusFilter?: string
  parentFilter?: string
  sortFilter?: string
}

export default function CategoriesDataTable({
  searchTerm = '',
  statusFilter = 'Tous',
  parentFilter = 'Toutes',
  sortFilter = 'Ordre (croissant)'
}: CategoriesDataTableProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [currentPage, pageSize, searchTerm, statusFilter, parentFilter, sortFilter])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, count } = await getCategories({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined
      })
      
      let filtered = data || []

      // Status filter
      if (statusFilter === 'Active') {
        filtered = filtered.filter(c => c.is_active)
      } else if (statusFilter === 'Masquée') {
        filtered = filtered.filter(c => !c.is_active)
      }

      // Parent filter
      if (parentFilter === 'Principales') {
        filtered = filtered.filter(c => !c.parent_id)
      } else if (parentFilter === 'Sous-catégories') {
        filtered = filtered.filter(c => !!c.parent_id)
      }

      // Sorting
      if (sortFilter === 'Nom A-Z') {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortFilter === 'Nom Z-A') {
        filtered.sort((a, b) => b.name.localeCompare(a.name))
      } else if (sortFilter === 'Ordre (décroissant)') {
        filtered.sort((a, b) => (b.display_order ?? 0) - (a.display_order ?? 0))
      } else {
        filtered.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      }

      setCategories(filtered)
      setTotalCount(count || filtered.length)
    } catch (err: any) {
      console.error('Erreur lors du chargement des catégories:', err)
      setError(err?.message || 'Impossible de charger les catégories.')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteCategory(id)
      setDeleteModalId(null)
      await loadCategories()
    } catch (err: any) {
      alert(err?.message || 'Erreur lors de la suppression de la catégorie.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (category: Category) => {
    try {
      await updateCategory(category.id, {
        is_active: !category.is_active
      })
      await loadCategories()
    } catch (err: any) {
      alert(err?.message || 'Erreur lors de la modification du statut.')
    }
  }

  const getCategoryIcon = (name?: string | null, icon?: string | null) => {
    if (icon && icon.length < 5) return icon
    if (!name) return '📁'
    const iconMap: { [key: string]: string } = {
      'chaussures': '👟',
      'vêtements': '👕',
      'accessoires': '👜',
      'sneakers': '👟',
      'baskets': '👟',
      'sandales': '👡',
      'montres': '⌚',
      'ceintures': '👔'
    }
    return iconMap[name.toLowerCase()] || '📁'
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return { date: '15 Mai 2026', time: '10:30' }
    const date = new Date(dateStr)
    const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    return { date: formattedDate, time: formattedTime }
  }

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  if (loading && categories.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={loadCategories} className="underline text-red-800 font-bold">Réessayer</button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-3 w-8 text-center"></th>
              <th className="py-3 px-4">Catégorie</th>
              <th className="py-3 px-4">Catégorie parente</th>
              <th className="py-3 px-4 text-center">Sous-catégories</th>
              <th className="py-3 px-4 text-center">Produits</th>
              <th className="py-3 px-4 text-center">Statut</th>
              <th className="py-3 px-4 text-center">Ordre</th>
              <th className="py-3 px-4 text-left">Date d'ajout</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 px-6 text-center text-gray-500">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    📁
                  </div>
                  <p className="text-base font-bold text-gray-900">Aucune catégorie trouvée</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Créez votre première catégorie pour organiser vos articles sur la boutique EVA SHOE.
                  </p>
                  <Link
                    href="/categories/ajouter"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#C89B3C] text-black font-bold rounded-lg hover:bg-[#b8892f] transition-colors text-xs shadow-xs"
                  >
                    + Ajouter une catégorie
                  </Link>
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const { date, time } = formatDate(category.created_at)
                const isSub = Boolean(category.parent_id)

                return (
                  <tr key={category.id} className="hover:bg-amber-50/30 transition-colors group">
                    {/* Drag Handle */}
                    <td className="py-3 px-3 text-center text-gray-300 group-hover:text-gray-400 cursor-grab">
                      <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 4h2v2H9V4zm4 0h2v2h-2V4zM9 11h2v2H9v-2zm4 0h2v2h-2v-2zm-4 7h2v2H9v-2zm4 0h2v2h-2v-2z" />
                      </svg>
                    </td>

                    {/* Catégorie (Icon + Name + Slug) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-50 border border-amber-200/70 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-2xs">
                          {getCategoryIcon(category?.name, category?.icon)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate flex items-center gap-1.5">
                            <span>{category?.name || 'Sans nom'}</span>
                            {category.is_featured && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded" title="Mise en avant">
                                ⭐ Star
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 font-mono truncate">
                            /{category?.slug || ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Catégorie parente */}
                    <td className="py-3 px-4">
                      {category?.parent_name ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-md text-amber-900 font-semibold text-xs">
                          <span>📁</span>
                          <span>{category.parent_name}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs font-medium italic">
                          — Catégorie Principale
                        </span>
                      )}
                    </td>

                    {/* Sous-catégories count */}
                    <td className="py-3 px-4 text-center">
                      {!isSub ? (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gray-200">
                          2 sous-cat.
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Produits count */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
                        {isSub ? '8 produits' : '24 produits'}
                      </span>
                    </td>

                    {/* Statut Badge */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(category)}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer border ${
                          category.is_active
                            ? 'bg-[#EAF8F1] text-emerald-800 border-[#D1F2DF] hover:bg-emerald-100'
                            : 'bg-[#FDEAEA] text-rose-800 border-[#FCD4D4] hover:bg-rose-100'
                        }`}
                        title="Cliquer pour basculer le statut"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${category.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{category.is_active ? 'Active' : 'Masquée'}</span>
                      </button>
                    </td>

                    {/* Ordre */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-xs font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md border border-gray-200">
                        {category?.display_order ?? 1}
                      </span>
                    </td>

                    {/* Date d'ajout */}
                    <td className="py-3 px-4">
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">{date}</p>
                        <p className="text-[11px] text-gray-400">{time}</p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/categories/modifier/${category.id}`}
                          className="p-1.5 text-gray-500 hover:text-[#C89B3C] hover:bg-amber-50 rounded-lg transition-colors"
                          title="Modifier la catégorie"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        
                        <button
                          type="button"
                          onClick={() => setDeleteModalId(category.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de suppression */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
              <p className="text-xs text-gray-500 mt-2">
                Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action retirera la catégorie et ses sous-catégories affiliées.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteModalId)}
                disabled={deletingId === deleteModalId}
                className="flex-1 px-4 py-2.5 text-xs font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingId === deleteModalId ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {totalCount > 0 && (
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-gray-500 font-medium">
            Affichage de <span className="font-bold text-gray-900">{((currentPage - 1) * pageSize) + 1}</span> à <span className="font-bold text-gray-900">{Math.min(currentPage * pageSize, totalCount)}</span> sur <span className="font-bold text-gray-900">{totalCount}</span> catégories
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-0.5 bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                title="Première page"
              >
                «
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                title="Page précédente"
              >
                ‹
              </button>

              <span className="px-3 py-1 font-bold text-gray-800">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                title="Page suivante"
              >
                ›
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                title="Dernière page"
              >
                »
              </button>
            </div>

            <select 
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-2.5 py-1.5 text-xs font-bold border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent cursor-pointer"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}