// src/app/(dashboard)/categories/ajouter/page.tsx
import CategoryForm from '@/components/dashboard/categories/category-form'

export default function AddCategoryPage() {
  return (
    <div className="space-y-6">
      {/* Header avec breadcrumb */}
      <div>
        <nav className="flex text-sm text-gray-600 mb-4">
          <span>Tableau de bord</span>
          <span className="mx-2">›</span>
          <span>Catégories</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">Ajouter une catégorie</span>
        </nav>
        
        <h1 className="text-2xl font-bold text-gray-900">Ajouter une catégorie</h1>
      </div>

      {/* Formulaire */}
      <CategoryForm />
    </div>
  )
}