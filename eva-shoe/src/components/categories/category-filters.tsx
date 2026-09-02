// src/components/categories/category-filters.tsx
'use client'

interface CategoryFiltersProps {
  categorySlug: string
}

export default function CategoryFilters({ categorySlug }: CategoryFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Filtres</h3>
      
      {/* Prix */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Prix</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">0 - 50 000 FCFA</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">50 000 - 100 000 FCFA</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">100 000 FCFA et plus</span>
          </label>
        </div>
      </div>

      {/* Tailles */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Tailles</h4>
        <div className="grid grid-cols-3 gap-2">
          {['36', '37', '38', '39', '40', '41', '42', '43', '44'].map((size) => (
            <button
              key={size}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#C89B3C] hover:text-[#C89B3C] transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Couleurs */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Couleurs</h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: 'Noir', color: 'bg-black' },
            { name: 'Blanc', color: 'bg-white border' },
            { name: 'Marron', color: 'bg-amber-800' },
            { name: 'Rouge', color: 'bg-red-500' }
          ].map((color) => (
            <button
              key={color.name}
              className={`w-8 h-8 rounded-full ${color.color} hover:scale-110 transition-transform`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Marques */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Marques</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Nike</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Adidas</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]" />
            <span className="text-sm text-gray-600">Puma</span>
          </label>
        </div>
      </div>
    </div>
  )
}