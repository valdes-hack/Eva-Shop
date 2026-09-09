// src/components/dashboard/categories/categories-filters.tsx
'use client'

interface CategoriesFiltersProps {
  filtersHook: any
}

export default function CategoriesFilters({ filtersHook }: CategoriesFiltersProps) {
  const {
    filters,
    updateSearch,
    updateStatus,
    updateParent,
    updateSort,
    resetFilters,
    hasActiveFilters,
    filterCount,
    sortOptions
  } = filtersHook

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-4">
      <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
        {/* Barre de recherche */}
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={filters.search}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filtre Statut */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Statut :</span>
            <select
              value={filters.status}
              onChange={(e) => updateStatus(e.target.value as 'all' | 'active' | 'hidden')}
              className="bg-transparent border-none text-xs font-bold text-gray-800 focus:ring-0 cursor-pointer p-0"
            >
              <option value="all">Tous</option>
              <option value="active">Active</option>
              <option value="hidden">Masquée</option>
            </select>
          </div>

          {/* Filtre Catégorie parente */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Parente :</span>
            <select
              value={filters.parent}
              onChange={(e) => updateParent(e.target.value as 'all' | 'main' | 'sub')}
              className="bg-transparent border-none text-xs font-bold text-gray-800 focus:ring-0 cursor-pointer p-0"
            >
              <option value="all">Toutes</option>
              <option value="main">Principales uniquement</option>
              <option value="sub">Sous-catégories</option>
            </select>
          </div>

          {/* Filtre Tri */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Trier par :</span>
            <select
              value={filters.sort}
              onChange={(e) => updateSort(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-gray-800 focus:ring-0 cursor-pointer p-0"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Indicateur de filtres actifs */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5 bg-[#C89B3C]/10 border border-[#C89B3C]/30 rounded-lg px-2.5 py-1.5">
              <div className="w-2 h-2 bg-[#C89B3C] rounded-full"></div>
              <span className="text-xs font-bold text-[#C89B3C]">
                {filterCount} filtre{filterCount > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Bouton de réinitialisation */}
          {hasActiveFilters && (
            <button 
              type="button"
              onClick={resetFilters}
              className="px-3.5 py-2.5 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Résumé des filtres appliqués */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">Filtres appliqués :</span>
          
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full">
              Recherche: "{filters.search}"
              <button 
                onClick={() => updateSearch('')}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-800 text-xs font-medium rounded-full">
              Statut: {filters.status === 'active' ? 'Active' : 'Masquée'}
              <button 
                onClick={() => updateStatus('all')}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.parent !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-800 text-xs font-medium rounded-full">
              Type: {filters.parent === 'main' ? 'Principales' : 'Sous-catégories'}
              <button 
                onClick={() => updateParent('all')}
                className="text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.sort !== 'order-asc' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-800 text-xs font-medium rounded-full">
              Tri: {sortOptions.find(opt => opt.value === filters.sort)?.label}
              <button 
                onClick={() => updateSort('order-asc')}
                className="text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
