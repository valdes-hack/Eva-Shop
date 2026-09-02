// src/app/(public)/layout.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import UserMenu from '@/components/layout/user-menu'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      {/* =============================================
      1. BARRE SUPÉRIEURE (Top Bar)
      ============================================= */}
      <div className="bg-[#F8F8F8] border-b border-gray-200 text-xs py-2">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          {/* Gauche : Avantages */}
          <div className="flex items-center gap-6 text-gray-700 font-medium">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Livraison rapide partout en Afrique
            </span>
            <span className="hidden md:flex items-center gap-2">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Paiement sécurisé
            </span>
            <span className="hidden lg:flex items-center gap-2">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retour sous 7 jours
            </span>
          </div>

          {/* Droite : Contact & Réseaux */}
          <div className="flex items-center gap-4 text-gray-700">
            <span className="hidden sm:inline text-gray-500">Besoin d'aide ?</span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <a href="tel:+2376XXXXXXXX" className="flex items-center gap-1.5 font-semibold text-black hover:text-[#C89B3C] transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
              </svg>
              +237 6XX XXX XXX
            </a>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-500">Suivez-nous</span>
              <a href="#" className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#C89B3C] transition-colors text-[10px]">
                f
              </a>
              <a href="#" className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#C89B3C] transition-colors text-[10px]">
                in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =============================================
      2. HEADER PRINCIPAL (Logo, Recherche, Compte)
      ============================================= */}
      <header className="bg-white border-b border-gray-100 py-3.5 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo EVA SHOE */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg className="w-9 h-9 text-black group-hover:scale-105 transition-transform" viewBox="0 0 40 40" fill="none">
                  {/* High heel silhouette path matching logo mockup */}
                  <path d="M8 28C8 28 10 22 14 20C18 18 26 18 30 14C32 12 34 8 34 8C34 8 33 18 29 23C25 28 18 29 14 29C10 29 8 28 8 28Z" fill="#18181B" />
                  <path d="M30 14L34 32H31L28 20" fill="#18181B" />
                  <circle cx="28" cy="14" r="3" fill="#C89B3C" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold tracking-tight font-serif text-black">
                EVA <span className="text-[#C89B3C]">SHOE</span>
              </span>
            </Link>

            {/* Barre de recherche */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full flex items-center">
                <input
                  type="search"
                  placeholder="Rechercher des chaussures..."
                  className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-l-lg focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                />
                <button className="px-5 py-2.5 bg-[#0F172A] text-white rounded-r-lg hover:bg-black transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center gap-6 text-gray-800">
              {/* Mon Compte */}
              <UserMenu />

              {/* Favoris */}
              <Link href="/favoris" className="flex items-center gap-1.5 hover:text-[#C89B3C] transition-colors relative group">
                <svg className="w-6 h-6 text-gray-800 group-hover:text-[#C89B3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline text-xs font-semibold text-gray-800">Favoris</span>
                <span className="bg-[#C89B3C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </Link>

              {/* Panier */}
              <Link href="/panier" className="flex items-center gap-1.5 hover:text-[#C89B3C] transition-colors relative group">
                <svg className="w-6 h-6 text-gray-800 group-hover:text-[#C89B3C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden sm:inline text-xs font-semibold text-gray-800">Panier</span>
                <span className="bg-[#C89B3C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =============================================
      3. NAVIGATION PRINCIPALE (Barre Noire)
      ============================================= */}
      <nav className="bg-[#0F172A] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Bouton Catégories + Liens de Navigation */}
            <div className="flex items-center">
              {/* Bouton CATÉGORIES */}
              <button className="bg-[#1E293B] hover:bg-slate-800 text-white px-5 py-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-3 transition-colors border-r border-slate-700">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>CATÉGORIES</span>
                <svg className="w-3.5 h-3.5 text-gray-300 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Liens de nav */}
              <div className="hidden lg:flex items-center text-xs font-bold tracking-wider">
                <Link href="/" className="px-5 py-3.5 text-[#C89B3C] border-b-2 border-[#C89B3C] hover:bg-slate-800/50 transition-colors uppercase">ACCUEIL</Link>
                <Link href="/categories/femme" className="px-5 py-3.5 text-gray-200 hover:text-white hover:bg-slate-800/50 transition-colors uppercase">FEMME</Link>
                <Link href="/categories/homme" className="px-5 py-3.5 text-gray-200 hover:text-white hover:bg-slate-800/50 transition-colors uppercase">HOMME</Link>
                <Link href="/categories/enfant" className="px-5 py-3.5 text-gray-200 hover:text-white hover:bg-slate-800/50 transition-colors uppercase">ENFANT</Link>
                <Link href="/categories/sneakers" className="px-5 py-3.5 text-gray-200 hover:text-white hover:bg-slate-800/50 transition-colors uppercase">SNEAKERS</Link>
                <Link href="/categories/accessoires" className="px-5 py-3.5 text-gray-200 hover:text-white hover:bg-slate-800/50 transition-colors uppercase">ACCESSOIRES</Link>
                <Link href="/nouveautes" className="px-5 py-3.5 text-gray-200 hover:text-white hover:bg-slate-800/50 transition-colors uppercase">NOUVEAUTÉS</Link>
                <Link href="/promotions" className="px-5 py-3.5 text-red-500 hover:text-red-400 hover:bg-slate-800/50 transition-colors uppercase font-extrabold">PROMOTIONS</Link>
              </div>
            </div>

            {/* Suivi de Commande */}
            <Link href="/suivi" className="flex items-center gap-2 px-4 py-3.5 text-gray-200 hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-bold uppercase tracking-wider">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>SUIVI DE COMMANDE</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* =============================================
      CONTENU PRINCIPAL DE LA PAGE
      ============================================= */}
      <main className="flex-1 bg-white">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C89B3C]"></div>
          </div>
        }>
          {children}
        </Suspense>
      </main>

      {/* =============================================
      FOOTER
      ============================================= */}
      <footer className="bg-[#0F172A] text-gray-300 text-xs border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Colonne 1 : Marque & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-extrabold font-serif text-white">
                  EVA <span className="text-[#C89B3C]">SHOE</span>
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Votre destination pour les chaussures, vêtements et accessoires de qualité adaptés au marché africain.
              </p>
            </div>

            {/* Colonne 2 : Navigation */}
            <div>
              <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/produits" className="hover:text-[#C89B3C] transition-colors">Produits</Link></li>
                <li><Link href="/categories" className="hover:text-[#C89B3C] transition-colors">Catégories</Link></li>
                <li><Link href="/collections" className="hover:text-[#C89B3C] transition-colors">Collections</Link></li>
                <li><Link href="/nouveautes" className="hover:text-[#C89B3C] transition-colors">Nouveautés</Link></li>
                <li><Link href="/promotions" className="hover:text-[#C89B3C] transition-colors">Promotions</Link></li>
              </ul>
            </div>

            {/* Colonne 3 : Informations */}
            <div>
              <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">Informations</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-[#C89B3C] transition-colors">À propos</Link></li>
                <li><Link href="/contact" className="hover:text-[#C89B3C] transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-[#C89B3C] transition-colors">FAQ</Link></li>
                <li><Link href="/livraison" className="hover:text-[#C89B3C] transition-colors">Livraison</Link></li>
                <li><Link href="/retours" className="hover:text-[#C89B3C] transition-colors">Retours & Échanges</Link></li>
              </ul>
            </div>

            {/* Colonne 4 : Contact */}
            <div>
              <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4">Contactez-nous</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2"><span>Douala, Cameroun</span></li>
                <li className="flex items-center gap-2"><a href="tel:+2376XXXXXXXX" className="hover:text-[#C89B3C] transition-colors">+237 6XX XXX XXX</a></li>
                <li className="flex items-center gap-2"><a href="mailto:contact@evashoe.com" className="hover:text-[#C89B3C] transition-colors">contact@evashoe.com</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} EVA SHOE. Tous droits réservés.</p>
            <div className="flex gap-6 text-gray-400">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
              <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

