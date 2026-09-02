// src/components/categories/category-products.tsx
'use client'

import { useEffect, useState } from 'react'
import ProductsGrid from '@/components/produits/products-grid'
import { getProductsByCategory } from '@/lib/services/product-client.service'
import type { Product } from '@/lib/types/product.types'

interface CategoryProductsProps {
  categorySlug: string
  searchParams?: {
    sort?: string
    filter?: string
    price_min?: string
    price_max?: string
    size?: string
    color?: string
    page?: string
  }
}

export default function CategoryProducts({ categorySlug, searchParams }: CategoryProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await getProductsByCategory(categorySlug)
        setProducts(data)
      } catch (err) {
        setError('Erreur lors du chargement des produits')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [categorySlug, searchParams])

  return (
    <ProductsGrid 
      products={products}
      isLoading={isLoading}
      error={error}
    />
  )
}