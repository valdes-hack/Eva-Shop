// src/components/dashboard/categories/categories-filters.tsx
'use client'

import { useState } from 'react'

export default function CategoriesFilters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [parentFilter, setParentFilter] = useState('Toutes')
  const [sortFilter, setSortFilter] = useState('Ordre (croissant)')

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Barre de recherche */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3">
          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          >
            <option>Tous</option>
            <option>Active</option>
            <option>Masquée</option>
          </select>

          {/* Filtre Catégorie parente */}
          <select
            value={parentFilter}
            onChange={(e) => setParentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          >
            <option>Toutes</option>
            <option>Chaussures</option>
            <option>Vêtements</option>
            <option>Accessoires</option>
          </select>

          {/* Filtre Tri */}
          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
          >
            <option>Ordre (croissant)</option>
            <option>Ordre (décroissant)</option>
            <option>Nom A-Z</option>
            <option>Nom Z-A</option>
            <option>Date création</option>
          </select>

          {/* Boutons d'action */}
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrer
          </button>

          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}