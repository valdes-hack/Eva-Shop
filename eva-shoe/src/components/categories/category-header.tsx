// src/components/categories/category-header.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/lib/types/category.types'

interface CategoryHeaderProps {
  category: Category
}

export default function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Image de fond */}
      {category.image_url && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      
      {/* Contenu */}
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Accueil
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
            Catégories
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#C89B3C] font-medium">{category.name}</span>
        </nav>

        <div className="max-w-2xl">
          {/* Badge parent */}
          {category.parent_name && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-4">
              <span className="text-gray-300">Sous-catégorie de</span>
              <span className="text-[#C89B3C] font-medium">{category.parent_name}</span>
            </div>
          )}

          {/* Titre principal */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            {category.name}
            {category.icon && (
              <span className="ml-4 text-[#C89B3C]">{category.icon}</span>
            )}
          </h1>

          {/* Description */}
          {category.description && (
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {category.description}
            </p>
          )}

          {/* Statistiques */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm">
                <span className="font-semibold text-white">{category.products_count}</span>
                <span className="text-gray-300 ml-1">produits disponibles</span>
              </span>
            </div>

            {category.is_featured && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#C89B3C]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-300">Catégorie en vedette</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="bg-[#C89B3C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#b8892f] transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Filtrer les produits
            </button>
            
            <Link 
              href="/collections"
              className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              Voir les collections
            </Link>
          </div>
        </div>
      </div>

      {/* Décoration géométrique */}
      <div className="absolute top-0 right-0 opacity-10">
        <svg className="w-96 h-96" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="2"/>
          <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="2"/>
          <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
    </section>
  )
}