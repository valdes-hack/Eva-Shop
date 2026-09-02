// src/app/(public)/produits/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/services/product.service'

// =====================================================
// PAGE PRODUIT - DÉTAIL
// =====================================================
interface PageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = params

  try {
    const product = await getProductBySlug(slug)

    if (!product) {
      return notFound()
    }

    // Prix affiché (prix soldé ou prix normal)
    const displayPrice = product.sale_price || product.price

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Accueil</Link>
          <span className="mx-2">/</span>
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-primary-600">
                {product.category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-gray-700">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* =============================================
          COLONNE GAUCHE : IMAGES
          ============================================= */}
          <div>
            <div className="bg-gray-100 rounded-xl aspect-square relative overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].image_url}
                  alt={product.images[0].alt_text || product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Image non disponible</span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((image) => (
                  <div key={image.id} className="w-20 h-20 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary-500">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =============================================
          COLONNE DROITE : INFORMATIONS
          ============================================= */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-sm text-gray-500 mb-4">Marque : {product.brand}</p>
            )}

            {/* Prix */}
            <div className="flex items-center gap-3 mb-4">
              <p className="text-3xl font-bold text-primary-700">
                {displayPrice.toLocaleString()} FCFA
              </p>
              {product.sale_price && product.price > product.sale_price && (
                <p className="text-lg text-gray-400 line-through">
                  {product.price.toLocaleString()} FCFA
                </p>
              )}
              {product.sale_price && (
                <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                  -{Math.round((1 - product.sale_price / product.price) * 100)}%
                </span>
              )}
            </div>

            {/* Disponibilité */}
            <div className="mb-4">
              {product.variants && product.variants.some(v => v.stock_quantity > 0) ? (
                <span className="text-green-600 font-medium">✅ En stock</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Rupture de stock</span>
              )}
            </div>

            {/* Description courte */}
            {product.short_description && (
              <p className="text-gray-600 mb-4">{product.short_description}</p>
            )}

            {/* Description détaillée */}
            {product.description && (
              <div className="prose prose-sm mb-6">
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Sélection des variantes (à développer) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Variantes disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {/* Affichage simplifié des variantes */}
                  {product.variants.slice(0, 6).map((variant) => (
                    <div key={variant.id} className="border rounded-lg px-3 py-2 text-sm">
                      {variant.size && <span className="font-medium">{variant.size}</span>}
                      {variant.size && variant.color && <span className="mx-1">·</span>}
                      {variant.color && <span>{variant.color}</span>}
                      {variant.stock_quantity > 0 ? (
                        <span className="text-green-600 text-xs ml-2">✔</span>
                      ) : (
                        <span className="text-red-600 text-xs ml-2">✖</span>
                      )}
                    </div>
                  ))}
                  {product.variants.length > 6 && (
                    <div className="border rounded-lg px-3 py-2 text-sm text-gray-500">
                      +{product.variants.length - 6} autres
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex-1">
                Ajouter au panier
              </button>
              <button className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                ❤️ Ajouter aux favoris
              </button>
            </div>

            {/* Informations complémentaires */}
            <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-4 text-sm text-gray-600">
              {product.sku && (
                <div>
                  <span className="font-medium">Référence :</span> {product.sku}
                </div>
              )}
              {product.category && (
                <div>
                  <span className="font-medium">Catégorie :</span>{' '}
                  <Link href={`/categories/${product.category.slug}`} className="text-primary-600 hover:underline">
                    {product.category.name}
                  </Link>
                </div>
              )}
              {product.gender && (
                <div>
                  <span className="font-medium">Genre :</span> {product.gender}
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="font-medium">Poids :</span> {product.weight} kg
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Erreur page produit:', error)
    return notFound()
  }
}