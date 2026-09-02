// src/components/categories/categories-hero.tsx
'use client'

export default function CategoriesHero() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Découvrez nos <span className="text-[#C89B3C]">catégories</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Explorez notre large gamme de chaussures et accessoires pour tous les styles et toutes les occasions.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Livraison gratuite dès 50 000 FCFA</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-[#C89B3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Garantie qualité</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Décoration */}
      <div className="absolute top-0 right-0 opacity-10">
        <svg className="w-96 h-96" viewBox="0 0 400 400" fill="none">
          <path d="M200 0C200 110.457 110.457 200 0 200C110.457 200 200 289.543 200 400C200 289.543 289.543 200 400 200C289.543 200 200 110.457 200 0Z" fill="currentColor"/>
        </svg>
      </div>
    </section>
  )
}