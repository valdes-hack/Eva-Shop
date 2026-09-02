📄 INTRODUCTION DU PROJET EVA SHOE
1. PRÉSENTATION GÉNÉRALE DU PROJET
1.1. IDENTITÉ DU PROJET
Élément	Détail
Nom du site	EVA SHOE
Propriétaire	Eva
Secteur	E-commerce de mode (Vêtements, Chaussures, Accessoires)
Marché cible	Afrique (Cameroun, Côte d'Ivoire, Sénégal, Gabon, RDC)
Positionnement	Mode accessible, tendance, adaptée aux morphologies africaines
Valeur ajoutée	Paiements Mobile Money, livraison rapide, retours faciles, support WhatsApp
1.2. OBJECTIFS DU PROJET
Objectif principal :
Créer une plateforme e-commerce robuste, moderne et adaptée au marché africain pour la vente de chaussures, vêtements et accessoires.

Objectifs spécifiques :

#	Objectif	Description
1	Expérience utilisateur	Interface fluide, mobile-first, rapide (< 3s)
2	Paiements locaux	Intégration Mobile Money (Orange Money, MTN MoMo) + Stripe
3	Livraison	Gestion des zones, frais, suivi via WhatsApp
4	Administration	Backoffice complet pour gérer catalogue, commandes, stocks
5	Performance	PWA, mode hors ligne, images optimisées
6	Sécurité	Paiements sécurisés, données protégées, RGPD
7	Évolutivité	Architecture permettant d'ajouter des fonctionnalités
2. TECHNOLOGIES RETENUES
Composant	Technologie	Version
Framework	Next.js	14+ (App Router)
Langage	TypeScript	5+
Base de données	Supabase (PostgreSQL)	-
Authentification	Supabase Auth	-
Stockage	Supabase Storage	-
UI	Tailwind CSS	3+
Composants	Shadcn/ui	-
État	Zustand	-
Requêtes	React Query (TanStack)	-
Formulaires	React Hook Form + Zod	-
Paiements	Stripe + Orange Money API	-
Emails	SendGrid	-
SMS	Twilio	-
PWA	next-pwa	-
Hébergement	Vercel (Frontend) + Supabase (Backend)	-
3. FONCTIONNALITÉS PRIORITAIRES (MVP)
MUST HAVE (Indispensables au lancement)
#	Module	Fonctionnalités
1	Catalogue	Produits (CRUD), Variantes (taille, couleur), Catégories, Images
2	Panier	Ajout, modification, suppression, réservation de stock
3	Commande	Validation, suivi (statuts), historiques
4	Paiements	Paiement à la livraison (cash), Mobile Money
5	Livraison	Informations client, génération de numéro de suivi
6	Administration	Gestion des produits, commandes, stocks
7	Authentification	Inscription, connexion, profils clients
8	Backoffice	Dashboard, commandes, produits, stocks
9	Architecture	Next.js + Supabase + PWA (hors ligne)
SHOULD HAVE (Importants mais non bloquants)
#	Module	Fonctionnalités
1	Avis	Notes, commentaires, photos
2	Favoris	Sauvegarde de produits
3	Promotions	Codes promo, réductions
4	Statistiques	Ventes, produits populaires, panier moyen
5	Emails	Confirmations, relances (panier abandonné)
COULD HAVE (Optionnels, améliorations)
#	Module	Fonctionnalités
1	Collections	Lookbook, tenues complètes
2	Newsletter	Emails marketing
3	PWA avancée	Notifications push, synchronisation
4. FEUILLE DE ROUTE (TÂCHES PRINCIPALES)
Phase	Tâches	Durée estimée
Phase 1	Conception + Setup technique	1-2 semaines
Phase 2	Authentification + Profils	1 semaine
Phase 3	Catalogue produits + Catégories	2 semaines
Phase 4	Panier + Variantes	1-2 semaines
Phase 5	Commandes + Paiements (simplifiés)	2 semaines
Phase 6	Administration (Backoffice)	2 semaines
Phase 7	Tests, Optimisation, Mise en ligne	1-2 semaines
5. STRUCTURE DE L'ÉQUIPE
Rôle	Nom
Chef de projet / Propriétaire	Eva
Développeur Frontend	À définir
Développeur Backend	À définir
