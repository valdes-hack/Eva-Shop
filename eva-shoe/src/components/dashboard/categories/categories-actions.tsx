// src/components/dashboard/categories/categories-actions.tsx
'use client'

import Link from 'next/link'

export default function CategoriesActions() {
  return (
    <div className="flex items-center gap-3">
      {/* Bouton Importer */}
      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        Importer
      </button>

      {/* Bouton Exporter */}
      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Exporter
      </button>

      {/* Bouton Ajouter une catégorie */}
      <Link href="/categories/ajouter" className="px-4 py-2 bg-[#C89B3C] text-white rounded-lg hover:bg-[#b8892f] transition-colors flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une catégorie
      </Link>
    </div>
  )
}