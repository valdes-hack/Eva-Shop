// src/app/(dashboard)/categories/ajouter/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import CategoryFormWithIcons from '@/components/dashboard/categories/category-form-with-icons'
import Breadcrumb, { useDashboardBreadcrumb } from '@/components/dashboard/common/breadcrumb'
import type { Category } from '@/lib/types/category.types'

export default function AddCategoryPage() {
  const router = useRouter()
  const breadcrumb = useDashboardBreadcrumb()

  const breadcrumbItems = [
    breadcrumb.dashboard(),
    breadcrumb.categories(),
    breadcrumb.categoriesAdd()
  ]

  const handleSuccess = (category: Category) => {
    router.push('/categories')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="space-y-6">
      {/* Header avec breadcrumb */}
      <div>
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Ajouter une catégorie</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Créez une nouvelle catégorie pour organiser vos produits
        </p>
      </div>

      {/* Formulaire */}
      <CategoryFormWithIcons 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}