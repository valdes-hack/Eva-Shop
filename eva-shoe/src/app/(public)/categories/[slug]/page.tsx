// src/app/(public)/categories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import CategoryHeader from '@/components/categories/category-header'
import CategoryProducts from '@/components/categories/category-products'
import CategoryFilters from '@/components/categories/category-filters'
import ProductsGrid from '@/components/produits/products-grid'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { getCategoryBySlug } from '@/lib/services/category.service'

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    filter?: string
    price_min?: string
    price_max?: string
    size?: string
    color?: string
    page?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Récupérer la catégorie par slug
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la catégorie */}
      <CategoryHeader category={category} />

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar avec filtres */}
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="animate-pulse bg-white rounded-lg h-96"></div>}>
              <CategoryFilters categorySlug={params.slug} />
            </Suspense>
          </aside>

          {/* Grille des produits */}
          <main className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryProducts 
                categorySlug={params.slug}
                searchParams={searchParams}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

// Génération statique pour les catégories principales
export async function generateStaticParams() {
  try {
    // TODO: Récupérer toutes les catégories depuis la DB
    const categories = [
      { slug: 'chaussures-femme' },
      { slug: 'chaussures-homme' },
      { slug: 'sneakers' },
      { slug: 'chaussures-enfant' },
      { slug: 'accessoires' }
    ]

    return categories.map(category => ({
      slug: category.slug
    }))
  } catch {
    return []
  }
}

// Métadonnées dynamiques
export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: 'Catégorie non trouvée - EVA SHOE'
    }
  }

  return {
    title: `${category.name} - EVA SHOE`,
    description: category.description || `Découvrez notre collection ${category.name}`,
    keywords: `${category.name}, chaussures, EVA SHOE, mode, ${category.meta_title || ''}`,
  }
}