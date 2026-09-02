// src/app/(public)/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/services/product.service'
import type { Product } from '@/lib/types/product.types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Récupérer les produits mis en avant depuis Supabase
  let featuredProducts: Product[] = []
  try {
    featuredProducts = await getFeaturedProducts()
  } catch (error) {
    console.log('Utilisation du fallback produits:', error)
  }

  const collections = [
    {
      id: 'femme',
      title: 'FEMME',
      subtitle: 'Élégance et féminité',
      image: '/images/cat-femme.png',
      link: '/categories/femme',
    },
    {
      id: 'homme',
      title: 'HOMME',
      subtitle: 'Style et confort',
      image: '/images/cat-homme.png',
      link: '/categories/homme',
    },
    {
      id: 'enfant',
      title: 'ENFANT',
      subtitle: 'Confort et durabilité',
      image: '/images/cat-enfant.png',
      link: '/categories/enfant',
    },
    {
      id: 'sneakers',
      title: 'SNEAKERS',
      subtitle: 'Tendance et originalité',
      image: '/images/cat-sneakers.png',
      link: '/categories/sneakers',
    },
    {
      id: 'accessoires',
      title: 'ACCESSOIRES',
      subtitle: 'Complétez votre look',
      image: '/images/cat-accessoires.png',
      link: '/categories/accessoires',
    },
  ]

  return (
    <div className="flex flex-col gap-10 py-6">

      {/* =============================================
      SECTION 1 : HERO - BANNIÈRE NOUVELLE COLLECTION
      ============================================= */}
      <section className="container mx-auto px-4">
        <div className="bg-[#F5F1EB] rounded-3xl p-6 md:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Colonne gauche (Texte & CTA) */}
            <div className="lg:col-span-6 z-10">
              <span className="inline-block bg-gray-200/80 text-gray-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                NOUVELLE COLLECTION
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-4">
                Marchez avec style,<br />
                <span className="text-[#C89B3C]">vivez votre élégance.</span>
              </h1>
              <p className="text-gray-600 text-sm md:text-base mb-8 max-w-md">
                Découvrez notre sélection exclusive de chaussures pour femme, homme et enfant.
              </p>
              
              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/collections"
                  className="bg-black text-white px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm"
                >
                  DÉCOUVRIR LA COLLECTION
                </Link>
                <Link
                  href="/produits?nouveautes=true"
                  className="border border-gray-400 text-black px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-100/60 transition-all"
                >
                  VOIR LES NOUVEAUTÉS
                </Link>
              </div>

              {/* 3 Avantages sous les boutons */}
              <div className="grid grid-cols-3 gap-3 text-xs pt-4 border-t border-gray-300/60">
                <div className="flex items-center gap-2">
                  <div className="text-[#C89B3C]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">Paiement sécurisé</p>
                    <p className="text-[10px] text-gray-500">Mobile Money, Cartes & Plus</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-[#C89B3C]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">Livraison rapide</p>
                    <p className="text-[10px] text-gray-500">Partout en Afrique</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-[#C89B3C]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">Retour facile</p>
                    <p className="text-[10px] text-gray-500">Sous 7 jours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite (Image Podium & Floating Card) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-white">
                <Image
                  src="/images/hero-shoes.png"
                  alt="Nouvelle Collection EVA SHOE"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Carte Flottante 10% Réduction */}
              <div className="absolute bottom-4 right-4 bg-[#18181B] text-white p-4 md:p-5 rounded-2xl shadow-2xl border border-gray-800 max-w-[240px] z-20">
                <div className="flex items-start gap-3 mb-2">
                  <div className="bg-[#C89B3C]/20 p-2 rounded-xl text-[#C89B3C]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-white leading-snug">10% de réduction</p>
                    <p className="text-[11px] text-gray-400">sur votre première commande</p>
                  </div>
                </div>
                <button className="w-full bg-[#C89B3C] text-white py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-[#b08732] transition-colors mt-2">
                  J'EN PROFITE
                </button>
              </div>
            </div>

          </div>

          {/* Points de pagination du carrousel */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C89B3C]"></span>
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
          </div>
        </div>
      </section>

      {/* =============================================
      SECTION 2 : 5 AVANTAGES EN BARRE HORIZONTALE
      ============================================= */}
      <section className="border-y border-gray-100 py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-xs">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF8EE] flex items-center justify-center text-[#C89B3C] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">Paiement 100% sécurisé</p>
                <p className="text-[11px] text-gray-500">Mobile Money, Cartes & Plus</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF8EE] flex items-center justify-center text-[#C89B3C] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">Livraison rapide</p>
                <p className="text-[11px] text-gray-500">Partout en Afrique</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF8EE] flex items-center justify-center text-[#C89B3C] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">Retour facile</p>
                <p className="text-[11px] text-gray-500">Sous 7 jours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF8EE] flex items-center justify-center text-[#C89B3C] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 010-7.072m0 0l2.829 2.829m-2.829-2.829L3 3" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">Support client</p>
                <p className="text-[11px] text-gray-500">7j/7 sur WhatsApp</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF8EE] flex items-center justify-center text-[#C89B3C] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">Produits de qualité</p>
                <p className="text-[11px] text-gray-500">Sélectionnés avec soin</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =============================================
      SECTION 3 : NOS COLLECTIONS (5 Cartes)
      ============================================= */}
      <section className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-wide text-gray-900">
            NOS COLLECTIONS
          </h2>
          <Link href="/collections" className="text-xs font-bold text-gray-800 hover:text-[#C89B3C] flex items-center gap-1 transition-colors">
            Voir toutes les collections
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Grille 5 cartes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {collections.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="bg-[#F8F7F5] border border-gray-100 rounded-2xl p-3 flex flex-col items-center text-center hover:shadow-lg transition-all group"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-white">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 mb-0.5">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-500 mb-3 line-clamp-1">
                {item.subtitle}
              </p>
              <button className="bg-black text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full mt-auto">
                DÉCOUVRIR
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* =============================================
      SECTION 4 : MEILLEURES VENTES
      ============================================= */}
      <section className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-wide text-gray-900">
            MEILLEURES VENTES
          </h2>
          <Link href="/produits" className="text-xs font-bold text-gray-800 hover:text-[#C89B3C] flex items-center gap-1 transition-colors">
            Voir tout
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featuredProducts && featuredProducts.length > 0 ? (
            featuredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative aspect-square bg-[#F8F7F5]">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                      Image Produit
                    </div>
                  )}
                  {product.sale_price && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      -{Math.round((1 - product.sale_price / product.price) * 100)}%
                    </span>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-xs text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-[11px] text-gray-400 mb-2">{product.brand || 'EVA SHOE'}</p>
                  <div className="mt-auto pt-2 flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900">{product.price.toLocaleString()} FCFA</span>
                  </div>
                  <button className="mt-3 bg-black text-white text-[11px] font-bold uppercase py-2 rounded-lg hover:bg-gray-800 transition-colors w-full">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Fallback exemple produits
            [
              { name: 'Talons Hauts Élégants Noirs', price: '25 000 FCFA', img: '/images/cat-femme.png' },
              { name: 'Chaussures de Ville Cuir Homme', price: '35 000 FCFA', img: '/images/cat-homme.png' },
              { name: 'Baskets Enfants Confort Blanc', price: '18 000 FCFA', img: '/images/cat-enfant.png' },
              { name: 'Sneakers Urban Streetwear', price: '28 000 FCFA', img: '/images/cat-sneakers.png' },
            ].map((p, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative aspect-square bg-[#F8F7F5]">
                  <Image 
                    src={p.img} 
                    alt={p.name} 
                    fill 
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-xs text-gray-900 mb-1 leading-snug">{p.name}</h3>
                  <p className="text-[11px] text-gray-400 mb-2">EVA SHOE Collection</p>
                  <div className="mt-auto pt-2">
                    <span className="font-extrabold text-sm text-gray-900">{p.price}</span>
                  </div>
                  <button className="mt-3 bg-black text-white text-[11px] font-bold uppercase py-2.5 rounded-lg hover:bg-gray-800 transition-colors w-full tracking-wider">
                    AJOUTER AU PANIER
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  )
}
