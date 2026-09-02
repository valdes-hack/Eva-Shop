eva-shoe/
│
├── .env.local                         # Variables d'environnement (clés API)
├── .env.example                       # Exemple des variables (à commiter)
├── .gitignore                         # Fichiers à ignorer par Git
├── next.config.js                     # Configuration Next.js
├── tailwind.config.ts                 # Configuration Tailwind CSS
├── tsconfig.json                      # Configuration TypeScript
├── package.json                       # Dépendances et scripts
├── postcss.config.mjs                 # Configuration PostCSS
├── components.json                    # Configuration Shadcn/ui
├── README.md                          # Documentation du projet
│
├── public/                            # Fichiers statiques
│   ├── images/                        # Images du site
│   ├── icons/                         # Icônes (favicon, etc.)
│   └── fonts/                         # Polices personnalisées
│
├── src/                               # Code source
│   │
│   ├── app/                           # Application Next.js (App Router)
│   │   │
│   │   ├── (public)/                  # Pages publiques (accessibles sans auth)
│   │   │   ├── page.tsx               # Page d'accueil
│   │   │   ├── layout.tsx             # Layout public
│   │   │   ├── produits/
│   │   │   │   ├── page.tsx           # Liste des produits
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Détail d'un produit
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Page catégorie
│   │   │   ├── panier/
│   │   │   │   └── page.tsx           # Panier
│   │   │   ├── commande/
│   │   │   │   └── page.tsx           # Validation commande
│   │   │   ├── suivi/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Suivi commande
│   │   │   ├── collections/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Page collection
│   │   │   ├── about/
│   │   │   │   └── page.tsx           # À propos
│   │   │   └── contact/
│   │   │       └── page.tsx           # Contact
│   │   │
│   │   ├── (auth)/                    # Pages d'authentification
│   │   │   ├── layout.tsx             # Layout auth (sans header/footer)
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Connexion
│   │   │   ├── register/
│   │   │   │   └── page.tsx           # Inscription
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx           # Mot de passe oublié
│   │   │   └── verify-email/
│   │   │       └── page.tsx           # Vérification email
│   │   │
│   │   ├── (dashboard)/               # Backoffice (administration)
│   │   │   ├── layout.tsx             # Layout dashboard (sidebar)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx           # Dashboard admin
│   │   │   ├── produits/
│   │   │   │   ├── page.tsx           # Liste produits
│   │   │   │   ├── ajouter/
│   │   │   │   │   └── page.tsx       # Ajout produit
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Édition produit
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx           # Liste catégories
│   │   │   │   ├── ajouter/
│   │   │   │   │   └── page.tsx       # Ajout catégorie
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Édition catégorie
│   │   │   ├── commandes/
│   │   │   │   ├── page.tsx           # Liste commandes
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Détail commande
│   │   │   ├── stocks/
│   │   │   │   └── page.tsx           # Gestion stocks
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx           # Liste clients
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Détail client
│   │   │   ├── promotions/
│   │   │   │   └── page.tsx           # Gestion promotions
│   │   │   ├── statistiques/
│   │   │   │   └── page.tsx           # Statistiques
│   │   │   └── parametres/
│   │   │       └── page.tsx           # Paramètres du site
│   │   │
│   │   ├── api/                       # API Routes (backend Next.js)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── produits/
│   │   │   │   ├── route.ts           # GET (liste), POST (création)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts       # GET, PUT, DELETE
│   │   │   ├── categories/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── commandes/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── panier/
│   │   │   │   └── route.ts
│   │   │   ├── paiement/
│   │   │   │   ├── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   └── upload/
│   │   │       └── route.ts           # Upload images
│   │   │
│   │   ├── layout.tsx                 # Layout principal
│   │   ├── page.tsx                   # Page d'accueil
│   │   ├── loading.tsx                # Loading global
│   │   ├── error.tsx                  # Erreur globale
│   │   └── not-found.tsx              # Page 404
│   │
│   ├── components/                    # Composants React
│   │   │
│   │   ├── ui/                        # Composants UI (Shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── form.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/                    # Composants de mise en page
│   │   │   ├── header.tsx             # En-tête du site
│   │   │   ├── footer.tsx             # Pied de page
│   │   │   ├── sidebar.tsx            # Sidebar dashboard
│   │   │   └── navigation.tsx         # Navigation principale
│   │   │
│   │   ├── produits/                  # Composants produits
│   │   │   ├── product-card.tsx       # Carte produit
│   │   │   ├── product-grid.tsx       # Grille produits
│   │   │   ├── product-filters.tsx    # Filtres (taille, couleur, prix)
│   │   │   ├── product-variants.tsx   # Sélection variantes
│   │   │   ├── product-gallery.tsx    # Galerie images
│   │   │   ├── product-form.tsx       # Formulaire produit (admin)
│   │   │   └── product-list.tsx       # Liste produits (admin)
│   │   │
│   │   ├── panier/                    # Composants panier
│   │   │   ├── cart-item.tsx          # Ligne panier
│   │   │   ├── cart-summary.tsx       # Résumé panier
│   │   │   └── cart-empty.tsx         # Panier vide
│   │   │
│   │   ├── commandes/                 # Composants commandes
│   │   │   ├── order-status.tsx       # Statut commande
│   │   │   ├── order-tracking.tsx     # Suivi commande
│   │   │   ├── order-history.tsx      # Historique commandes
│   │   │   └── order-detail.tsx       # Détail commande (admin)
│   │   │
│   │   ├── dashboard/                 # Composants dashboard
│   │   │   ├── stats-card.tsx         # Carte KPI
│   │   │   ├── sales-chart.tsx        # Graphique ventes
│   │   │   ├── recent-orders.tsx      # Commandes récentes
│   │   │   └── inventory-status.tsx   # État des stocks
│   │   │
│   │   ├── auth/                      # Composants authentification
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   └── otp-verification.tsx
│   │   │
│   │   └── shared/                    # Composants partagés
│   │       ├── filters.tsx            # Filtres génériques
│   │       ├── pagination.tsx         # Pagination
│   │       ├── search-bar.tsx         # Barre de recherche
│   │       ├── breadcrumb.tsx         # Fil d'Ariane
│   │       └── loading-spinner.tsx    # Spinner de chargement
│   │
│   ├── lib/                           # Bibliothèques et utilitaires
│   │   │
│   │   ├── supabase/                  # Client Supabase
│   │   │   ├── client.ts              # Client côté navigateur
│   │   │   ├── server.ts              # Client côté serveur
│   │   │   ├── admin.ts               # Client admin (service role)
│   │   │   └── middleware.ts          # Middleware auth
│   │   │
│   │   ├── hooks/                     # Hooks personnalisés
│   │   │   ├── use-auth.ts
│   │   │   ├── use-products.ts
│   │   │   ├── use-cart.ts
│   │   │   ├── use-orders.ts
│   │   │   ├── use-filters.ts
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── store/                     # Gestion d'état (Zustand)
│   │   │   ├── cart-store.ts          # État du panier
│   │   │   ├── auth-store.ts          # État de l'auth
│   │   │   └── ui-store.ts            # État de l'UI (theme, loading)
│   │   │
│   │   ├── services/                  # Services (appels API)
│   │   │   ├── product.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── payment.service.ts
│   │   │   └── upload.service.ts
│   │   │
│   │   ├── types/                     # Types TypeScript
│   │   │   ├── product.types.ts
│   │   │   ├── category.types.ts
│   │   │   ├── order.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── cart.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── utils/                     # Fonctions utilitaires
│   │   │   ├── format.ts              # Formatage (prix, date)
│   │   │   ├── validators.ts          # Validation (Zod)
│   │   │   ├── helpers.ts             # Fonctions diverses
│   │   │   └── constants.ts           # Constantes globales
│   │   │
│   │   └── config/                    # Configuration
│   │       ├── site.config.ts         # Configuration du site
│   │       └── payment.config.ts      # Configuration paiements
│   │
│   ├── styles/                        # Styles CSS
│   │   ├── globals.css                # Styles globaux
│   │   └── tailwind.css               # Tailwind
│   │
│   └── middleware.ts                  # Middleware Next.js (auth, redirections)
│
└── supabase/                          # Configurations Supabase
    ├── migrations/                    # Migrations SQL
    ├── seeds/                         # Données de test
    ├── functions/                     # Edge Functions
    │   ├── stripe-webhook/
    │   ├── send-email/
    │   ├── send-sms/
    │   └── process-order/
    ├── policies/                      # RLS Policies
    └── config.toml                    # Configuration Supabase