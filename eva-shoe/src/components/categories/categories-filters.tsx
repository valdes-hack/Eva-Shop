// src/components/categories/categories-filters.tsx
'use client'

export default function CategoriesFilters() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Filtres</h3>
      
      {/* Type de catégorie */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Type</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Chaussures</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Accessoires</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Vêtements</span>
          </label>
        </div>
      </div>

      {/* Genre */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Genre</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Femme</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Homme</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Enfant</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Unisexe</span>
          </label>
        </div>
      </div>

      {/* Popularité */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Popularité</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">En vedette</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Meilleures ventes</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Nouveautés</span>
          </label>
        </div>
      </div>
    </div>
  )
}