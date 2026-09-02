// src/components/dashboard/categories/categories-header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CategoriesHeader() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des catégories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organisez vos produits par catégories pour faciliter la navigation
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Button */}
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              />
            </svg>
            Filtres
          </button>

          {/* Export Button */}
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exporter
          </button>

          {/* Add Category Button */}
          <Link
            href="/dashboard/categories/ajouter"
            className="px-6 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] transition-colors flex items-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle catégorie
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-500">Total catégories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">10</div>
          <div className="text-sm text-gray-500">Actives</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">3</div>
          <div className="text-sm text-gray-500">En vedette</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">245</div>
          <div className="text-sm text-gray-500">Produits liés</div>
        </div>
      </div>
    </div>
  )
}