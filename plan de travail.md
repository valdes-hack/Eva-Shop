markdown
# 📋 PLAN DE TÂCHES DÉTAILLÉ - PROJET EVA SHOE

---

## PHASE 1 : CONCEPTION + SETUP TECHNIQUE (Semaines 1-2)

### TÂCHE 1.1 : Configuration du Projet Next.js

| Élément | Détail |
|---------|--------|
| Objectif | Créer et configurer le projet Next.js avec TypeScript |
| Durée estimée | 1 jour |
| Prérequis | Node.js installé, compte Vercel, compte Supabase |

**Actions :**

1. Créer le projet Next.js
   ```bash
   npx create-next-app@latest eva-shoe --typescript --tailwind --app
Installer les dépendances de base

bash
npm install @supabase/supabase-js @supabase/ssr
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
npm install zustand @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install next-pwa
Configurer next.config.js avec PWA

Configurer tailwind.config.js

Configurer tsconfig.json

Mettre en place la structure de dossiers (src/app, src/components, src/lib, etc.)

TÂCHE 1.2 : Configuration Supabase
Élément	Détail
Objectif	Configurer le projet Supabase (base de données, auth, storage)
Durée estimée	1 jour
Prérequis	Compte Supabase créé
Actions :

Créer un projet Supabase

Configurer l'authentification (email + mot de passe, téléphone + OTP)

Créer les tables SQL (voir schéma précédent)

Configurer les RLS Policies

Mettre en place le Storage (bucket pour les images)

Configurer les variables d'environnement (.env.local)

TÂCHE 1.3 : Configuration du Client Supabase
Élément	Détail
Objectif	Mettre en place les clients Supabase (frontend, server)
Durée estimée	0.5 jour
Actions :

Créer src/lib/supabase/client.ts

Créer src/lib/supabase/server.ts

Créer src/lib/supabase/admin.ts

Créer src/lib/supabase/middleware.ts

TÂCHE 1.4 : Mise en Place du Design System
Élément	Détail
Objectif	Configurer le design system (couleurs, typographie, composants)
Durée estimée	1-2 jours
Actions :

Installer Shadcn/ui

bash
npx shadcn-ui@latest init
Ajouter les composants de base

bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add table
Définir les couleurs de la marque EVA SHOE

Primaire : #8B1A4A (bordeaux)

Secondaire : #1A1A2E (noir profond)

Accent : #D4A574 (doré)

Fond : #FAFAFA

Créer le layout principal (src/app/layout.tsx)

PHASE 2 : AUTHENTIFICATION + PROFILS (Semaine 3)
TÂCHE 2.1 : Inscription et Connexion
Élément	Détail
Objectif	Mettre en place l'authentification (email + mot de passe, téléphone + OTP)
Durée estimée	2 jours
Actions :

Créer la page d'inscription (src/app/(auth)/register/page.tsx)

Créer la page de connexion (src/app/(auth)/login/page.tsx)

Créer la page de vérification email (src/app/(auth)/verify-email/page.tsx)

Créer la page de mot de passe oublié (src/app/(auth)/forgot-password/page.tsx)

Créer les formulaires avec React Hook Form + Zod

Implémenter l'authentification avec Supabase

Gérer les sessions avec JWT

Créer les hooks useAuth, useUser

Protéger les routes avec middleware

Composants à créer :

src/components/auth/login-form.tsx

src/components/auth/register-form.tsx

src/components/auth/forgot-password-form.tsx

src/components/auth/otp-verification.tsx

TÂCHE 2.2 : Gestion des Profils
Élément	Détail
Objectif	Gérer les profils utilisateurs (clients)
Durée estimée	1-2 jours
Actions :

Créer la page de profil (src/app/(public)/profil/page.tsx)

Créer le formulaire d'édition du profil

Gérer l'upload de photo de profil (Supabase Storage)

Gérer les adresses de livraison (multiples)

Afficher l'historique des commandes

Afficher les favoris

PHASE 3 : CATALOGUE PRODUITS (Semaines 4-5)
TÂCHE 3.1 : Gestion des Catégories
Élément	Détail
Objectif	Mettre en place l'arborescence des catégories
Durée estimée	2 jours
Actions :

Créer les pages catégories (public) :

src/app/(public)/categories/[slug]/page.tsx

Créer la gestion des catégories (backoffice) :

src/app/(dashboard)/categories/page.tsx

src/app/(dashboard)/categories/ajouter/page.tsx

src/app/(dashboard)/categories/[id]/page.tsx

Créer les composants :

src/components/categories/category-card.tsx

src/components/categories/category-tree.tsx

src/components/categories/category-filters.tsx

Implémenter les services :

src/lib/services/category.service.ts

Implémenter l'upload d'image de catégorie

Gérer l'ordre d'affichage des catégories

TÂCHE 3.2 : Gestion des Produits
Élément	Détail
Objectif	Mettre en place la gestion des produits (CRUD complet)
Durée estimée	3-4 jours
Actions :

Créer la page d'accueil avec les produits en avant

src/app/(public)/page.tsx

Créer la page de liste des produits

src/app/(public)/produits/page.tsx

Créer la page détail d'un produit

src/app/(public)/produits/[slug]/page.tsx

Créer la gestion des produits (backoffice) :

src/app/(dashboard)/produits/page.tsx

src/app/(dashboard)/produits/ajouter/page.tsx

src/app/(dashboard)/produits/[id]/page.tsx

Créer les composants :

src/components/products/product-card.tsx

src/components/products/product-grid.tsx

src/components/products/product-filters.tsx

src/components/products/product-gallery.tsx

src/components/products/product-variants.tsx

src/components/products/product-form.tsx

Implémenter les services :

src/lib/services/product.service.ts

Implémenter la recherche et les filtres (full-text)

TÂCHE 3.3 : Gestion des Variantes (Taille, Couleur)
Élément	Détail
Objectif	Gérer les variantes (tailles, couleurs) par produit
Durée estimée	2 jours
Actions :

Créer le système de variantes dans le formulaire produit

Génération automatique des combinaisons (ex: 3 tailles × 4 couleurs = 12 variantes)

Gérer le stock par variante

Gérer le prix par variante

Gérer l'image par variante

Affichage des variantes sur la page produit

Gestion des variantes dans le panier

PHASE 4 : PANIER (Semaine 6)
TÂCHE 4.1 : Panier
Élément	Détail
Objectif	Mettre en place le panier d'achat
Durée estimée	3 jours
Actions :

Créer la page du panier (src/app/(public)/panier/page.tsx)

Créer le composant d'ajout au panier (avec sélection taille/couleur)

src/components/cart/add-to-cart.tsx

Créer les composants du panier :

src/components/cart/cart-item.tsx

src/components/cart/cart-summary.tsx

src/components/cart/cart-empty.tsx

Gérer l'état du panier avec Zustand (src/lib/store/cart-store.ts)

Gérer la réservation de stock (15 minutes)

Gérer le panier pour les utilisateurs connectés (sauvegarde en base)

Gérer le panier pour les utilisateurs non connectés (localStorage)

Implémenter la détection de panier abandonné (15 min, 1h, 24h)

PHASE 5 : COMMANDES ET PAIEMENTS (Semaines 7-8)
TÂCHE 5.1 : Processus de Commande
Élément	Détail
Objectif	Mettre en place le processus de commande complet
Durée estimée	3-4 jours
Actions :

Créer la page de validation de commande (src/app/(public)/commande/page.tsx)

Créer le formulaire de livraison (nom, adresse, téléphone)

Créer le récapitulatif de commande

Créer la page de confirmation (src/app/(public)/confirmation/[id]/page.tsx)

Implémenter les services :

src/lib/services/order.service.ts

Génération du numéro de commande unique (#EVA-2026-0001)

Gérer les statuts de commande (pending, confirmed, preparing, shipped, delivered, cancelled, refunded)

Historique des statuts (traçabilité)

TÂCHE 5.2 : Paiements Simplifiés
Élément	Détail
Objectif	Mettre en place les paiements (paiement à la livraison + Mobile Money)
Durée estimée	2 jours
Actions :

Intégrer le paiement à la livraison (cash)

Intégrer le paiement Mobile Money (Orange Money, MTN MoMo) → via API

Créer le composant de sélection de méthode de paiement

Gérer les transactions (historique)

Gérer les remboursements (partiel/total)

TÂCHE 5.3 : Redirection WhatsApp (Cycle de Commande)
Élément	Détail
Objectif	Intégrer le flux WhatsApp pour la confirmation des commandes
Durée estimée	1 jour
Actions :

Après validation, envoyer la commande via WhatsApp à l'administrateur

Le client confirme la commande sur WhatsApp

L'administrateur prépare et expédie la commande

Génération du numéro de suivi

Notification au client

TÂCHE 5.4 : Suivi de Commande
Élément	Détail
Objectif	Permettre au client de suivre sa commande
Durée estimée	1-2 jours
Actions :

Créer la page de suivi (src/app/(public)/suivi/[id]/page.tsx)

Afficher le statut de la commande (en temps réel)

Afficher le numéro de suivi

Envoyer des notifications (email/SMS) à chaque changement de statut

Créer le composant src/components/orders/order-tracking.tsx

PHASE 6 : ADMINISTRATION (Semaines 9-10)
TÂCHE 6.1 : Dashboard Administrateur
Élément	Détail
Objectif	Créer le tableau de bord de l'administrateur
Durée estimée	2-3 jours
Actions :

Créer le layout du dashboard (src/app/(dashboard)/layout.tsx)

Créer la page dashboard (src/app/(dashboard)/dashboard/page.tsx)

Créer les composants :

src/components/dashboard/stats-card.tsx

src/components/dashboard/sales-chart.tsx

src/components/dashboard/recent-orders.tsx

src/components/dashboard/inventory-status.tsx

Afficher les KPI : ventes, commandes, clients, panier moyen

Graphique des ventes (30 jours)

Liste des commandes récentes

TÂCHE 6.2 : Gestion des Commandes (Backoffice)
Élément	Détail
Objectif	Gérer les commandes depuis le backoffice
Durée estimée	2 jours
Actions :

Créer la page de liste des commandes (src/app/(dashboard)/commandes/page.tsx)

Créer la page de détail d'une commande (src/app/(dashboard)/commandes/[id]/page.tsx)

Gérer les changements de statut (En préparation, Expédiée, Livrée, Annulée)

Gérer les retours et remboursements

Générer les documents (facture PDF, bon de livraison)

TÂCHE 6.3 : Gestion des Stocks (Backoffice)
Élément	Détail
Objectif	Gérer les stocks depuis le backoffice
Durée estimée	1-2 jours
Actions :

Créer la page d'état du stock (src/app/(dashboard)/stocks/page.tsx)

Afficher les produits par variante avec quantités

Gérer les alertes de stock bas

Mettre à jour le stock manuellement

Suivi des mouvements de stock (entrées/sorties)

Historique des mouvements

TÂCHE 6.4 : Gestion des Clients (Backoffice)
Élément	Détail
Objectif	Gérer les clients depuis le backoffice
Durée estimée	1 jour
Actions :

Créer la page de liste des clients (src/app/(dashboard)/clients/page.tsx)

Créer la page de détail d'un client (src/app/(dashboard)/clients/[id]/page.tsx)

Afficher l'historique des commandes par client

TÂCHE 6.5 : Gestion des Promotions (Backoffice)
Élément	Détail
Objectif	Gérer les promotions et codes promo
Durée estimée	1-2 jours
Actions :

Créer la page de gestion des promotions (src/app/(dashboard)/promotions/page.tsx)

Créer la page d'ajout/modification de promotion

Créer la page de gestion des codes promo

Génération de codes promo (aléatoire ou personnalisé)

Conditions d'utilisation (montant minimum, date de fin, etc.)

PHASE 7 : TESTS, OPTIMISATION, MISE EN LIGNE (Semaine 11)
TÂCHE 7.1 : Tests et Optimisation
Élément	Détail
Objectif	Tester toutes les fonctionnalités et optimiser
Durée estimée	3-4 jours
Actions :

Tests de toutes les fonctionnalités (catalogue, panier, commande, paiement, backoffice)

Tests de sécurité (authentification, accès protégés)

Optimisation des performances (images, chargement, SEO)

Tests mobile (PWA)

Tests de navigation (parcours utilisateur)

Corrections de bugs

TÂCHE 7.2 : Mise en Production
Élément	Détail
Objectif	Déployer le site en production
Durée estimée	1 jour
Actions :

Déployer sur Vercel

Configurer les variables d'environnement

Configurer le domaine personnalisé

Configurer SSL (HTTPS)

Mise en place des backups (Supabase)

Mise en place du monitoring

RÉCAPITULATIF GLOBAL
Phase	Tâches	Durée estimée
PHASE 1	Setup technique	2 semaines
PHASE 2	Authentification	1 semaine
PHASE 3	Catalogue produits	2 semaines
PHASE 4	Panier	1 semaine
PHASE 5	Commandes + Paiements	2 semaines
PHASE 6	Administration	2 semaines
PHASE 7	Tests + Mise en ligne	1 semaine
TOTAL		11 semaines