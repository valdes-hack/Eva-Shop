# 📚 Système de Catégories EVA SHOE - Documentation Complète

## 🎯 Vue d'ensemble

Le système de catégories d'EVA SHOE est une implémentation complète conforme au Cahier des Charges Fonctionnel, offrant :

- **Arborescence infinie** avec hiérarchie parent-enfant
- **Système d'attributs dynamiques** par catégorie
- **Héritage des attributs** des catégories parentes
- **Optimisation SEO** complète
- **Interface de gestion intuitive**

## 🏗️ Architecture

### 📦 Structure des tables

```sql
-- Table principale des catégories
categories
├── id (UUID, PK)
├── name (TEXT, NOT NULL)
├── slug (TEXT, UNIQUE)
├── description (TEXT)
├── parent_id (UUID, FK → categories.id)
├── image_url (TEXT)
├── banner_image_url (TEXT) -- ✨ NOUVEAU
├── icon (TEXT)
├── display_order (INTEGER)
├── is_featured (BOOLEAN)
├── is_active (BOOLEAN)
├── meta_title (TEXT)
├── meta_description (TEXT)
├── presentation_text (TEXT) -- ✨ NOUVEAU
├── seo_keywords (TEXT) -- ✨ NOUVEAU
├── hierarchy_path (TEXT) -- ✨ NOUVEAU (auto-généré)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

-- Système d'attributs
attributes
├── id (UUID, PK)
├── name (TEXT, NOT NULL)
├── slug (TEXT, UNIQUE)
├── type (ENUM: text, number, select, multi_select, color, size)
├── description (TEXT)
├── is_required (BOOLEAN)
├── validation_rules (JSONB)
├── display_order (INTEGER)
└── is_active (BOOLEAN)

-- Valeurs possibles pour les attributs
attribute_values
├── id (UUID, PK)
├── attribute_id (UUID, FK → attributes.id)
├── value (TEXT)
├── display_name (TEXT)
├── color_code (TEXT) -- Pour les couleurs
├── display_order (INTEGER)
└── is_active (BOOLEAN)

-- Liaison catégories ↔ attributs
category_attributes
├── id (UUID, PK)
├── category_id (UUID, FK → categories.id)
├── attribute_id (UUID, FK → attributes.id)
├── is_required (BOOLEAN)
├── is_inherited (BOOLEAN) -- ✨ Héritage des attributs
├── display_order (INTEGER)
└── created_at (TIMESTAMPTZ)

-- Valeurs des attributs pour les produits
product_attribute_values
├── id (UUID, PK)
├── product_id (UUID, FK → products.id)
├── attribute_id (UUID, FK → attributes.id)
├── attribute_value_id (UUID, FK → attribute_values.id)
├── text_value (TEXT)
├── number_value (DECIMAL)
└── created_at (TIMESTAMPTZ)
```

### 🔧 Fonctionnalités automatisées

#### 📍 Chemin hiérarchique automatique
```sql
-- Fonction qui calcule automatiquement le chemin
-- Ex: "VÊTEMENTS > Femme > Robes > Longues"
CREATE FUNCTION calculate_hierarchy_path(category_id UUID) RETURNS TEXT
```

#### 🧬 Héritage des attributs
```sql
-- Fonction qui hérite automatiquement des attributs du parent
CREATE FUNCTION inherit_parent_attributes(category_id UUID) RETURNS VOID
```

## 📋 Structure de catégories implémentée

### Niveau 0 : Catégories principales
- **VÊTEMENTS** (`vetements`)
- **CHAUSSURES** (`chaussures`)  
- **ACCESSOIRES** (`accessoires`)

### Niveau 1 : Par genre
- **Homme** (`vetements-homme`, `chaussures-homme`)
- **Femme** (`vetements-femme`, `chaussures-femme`)
- **Enfant** (`vetements-enfant`, `chaussures-enfant`)

### Niveau 2 : Détail par catégorie

#### Vêtements Homme
- Chemises, Pantalons, Costumes, T-shirts, Polo, Shorts, Vestes, Jeans, Sous-vêtements

#### Vêtements Femme  
- Robes, Jupes, Pantalons, T-shirts, Chemisiers, Vestes, Manteaux, Jeans, Sous-vêtements, Maillots de bain

#### Vêtements Enfant
- Filles (2-12 ans), Garçons (2-12 ans), Bébé (0-2 ans)

#### Chaussures par genre
- **Homme** : Baskets, Derbies, Mocassins, Sandales, Bottes, Sport
- **Femme** : Baskets, Escarpins, Sandales à talons, Ballerines, Bottes, Sport
- **Enfant** : Filles, Garçons, Bébé

#### Accessoires
- **Sacs** : Sacs à main, Sacs à dos, Portefeuilles, Ceintures
- **Bijoux** : Colliers, Bracelets, Boucles d'oreilles, Montres
- **Autres** : Chapeaux, Casquettes, Foulards, Cravates, Lunettes

## 🏷️ Système d'attributs

### Types d'attributs disponibles
- **text** : Texte libre (marque, matière)
- **number** : Valeur numérique (prix, poids)
- **select** : Sélection unique (taille, couleur)
- **multi_select** : Sélection multiple
- **color** : Couleur avec code hexadécimal
- **size** : Tailles spécialisées

### Attributs pré-configurés

#### 🎨 Couleurs
Noir, Blanc, Rouge, Bleu, Vert, Jaune, Rose, Violet, Orange, Gris, Marron, Beige

#### 👕 Tailles vêtements  
XS, S, M, L, XL, XXL, XXXL

#### 👟 Pointures
35 à 45 (toutes les tailles)

#### 📝 Attributs textuels
- Marque
- Matière  
- Collection
- Instructions d'entretien
- Style
- Coupe

## 🔧 Services et API

### CategoryOptimizedService
```typescript
// Récupération optimisée avec cache
getCategories(filters?: CategoryFilters): Promise<{data: Category[], count: number}>

// Hiérarchie complète
getCategoryHierarchy(): Promise<Category[]>

// Catégorie avec attributs
getCategoryWithAttributes(id: string): Promise<Category | null>

// Navigation (breadcrumb)  
getCategoryBreadcrumb(categoryId: string): Promise<Breadcrumb[]>

// Recherche avec autocomplétion
searchCategories(query: string, limit?: number): Promise<Category[]>

// Catégories mises en avant
getFeaturedCategories(limit?: number): Promise<Category[]>

// Actions avancées
duplicateCategory(id: string, newName: string): Promise<Category>
moveCategory(categoryId: string, newParentId: string | null): Promise<Category>
```

### CategoryAttributesService
```typescript
// Gestion des attributs
getAttributes(filters?: AttributeFilters): Promise<{data: Attribute[], count: number}>
createAttribute(data: AttributeData): Promise<Attribute>

// Valeurs d'attributs
getAttributeValues(attributeId: string): Promise<AttributeValue[]>
createAttributeValue(data: ValueData): Promise<AttributeValue>

// Liaison catégorie-attributs
getCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]>
addAttributeToCategory(data: LinkData): Promise<CategoryAttribute>
removeAttributeFromCategory(categoryId: string, attributeId: string): Promise<void>

// Héritage
inheritParentAttributes(categoryId: string): Promise<void>

// Produits
getProductAttributeValues(productId: string): Promise<ProductAttributeValue[]>
setProductAttributeValue(data: ProductValueData): Promise<ProductAttributeValue>
```

## 🎨 Composants UI

### 📁 CategoryHierarchyView
- **Arbre hiérarchique** interactif
- **Glisser-déposer** pour réorganiser
- **Indicateurs visuels** (statut, mise en avant)
- **Actions rapides** (modifier, dupliquer)

### 🏷️ CategoryAttributesManager  
- **Gestion des attributs** par catégorie
- **Ajout/suppression** d'attributs
- **Indicateurs d'héritage**
- **Configuration obligatoire/optionnel**

### 📝 CategoryFormExtended
- **Formulaire complet** avec onglets
- **Informations générales**
- **SEO et présentation**  
- **Gestion des attributs**
- **Validation en temps réel**

### 🎛️ Page de gestion complète
- **Interface unifiée** avec onglets
- **Sélection interactive**
- **Statistiques en temps réel**
- **Actions contextuelles**

## 🚀 Installation et utilisation

### 1. Mise à jour de la base de données
```bash
# Exécuter le script de mise à jour
psql -d eva_shoe -f CATEGORIES-COMPLETE-UPDATE.sql
```

### 2. Import des services
```typescript
import { 
  getCategoryHierarchy, 
  getCategoryWithAttributes 
} from '@/lib/services/category-optimized.service'

import { 
  getCategoryAttributes,
  addAttributeToCategory 
} from '@/lib/services/category-attributes.service'
```

### 3. Utilisation des composants
```tsx
import CategoryHierarchyView from '@/components/dashboard/categories/category-hierarchy-view'
import CategoryAttributesManager from '@/components/dashboard/categories/category-attributes-manager'
import CategoryFormExtended from '@/components/dashboard/categories/category-form-extended'

// Page de gestion complète
<CategoryHierarchyView 
  onCategorySelect={handleSelect}
  onCategoryUpdate={handleUpdate}
/>
```

## 📈 Optimisations

### 🚄 Performance
- **Cache en mémoire** (30s) pour les requêtes fréquentes
- **Requêtes optimisées** avec Supabase
- **Index sur les colonnes** critiques
- **Memoization React** pour les composants

### 🔍 Recherche
- **Index GIN** sur `hierarchy_path` avec `pg_trgm`
- **Recherche full-text** sur nom, slug et chemin
- **Autocomplétion** avec debounce

### 📱 UX/UI
- **Interface responsive**
- **États de chargement** avec skeletons
- **Feedback visuel** pour les actions
- **Glisser-déposer** intuitif

## 🛡️ Sécurité

### 🔒 Validation
- **Prévention des références circulaires**
- **Validation des types d'attributs**
- **Contraintes de base de données**
- **Sanitisation des entrées**

### 🎯 Permissions  
- **Gestion basée sur les rôles**
- **Actions contextuelles**
- **Logs d'audit** (created_at, updated_at)

## 📊 Statistiques et monitoring

### 📈 Métriques disponibles
- Nombre total de catégories
- Catégories par niveau hiérarchique
- Attributs par type  
- Utilisation des attributs
- Performance des requêtes

### 🔍 Debugging
- **Logs détaillés** dans les services
- **Gestion d'erreurs** robuste
- **Cache monitoring**
- **Performance tracking**

## 🔄 Migration et évolution

### 📦 Structure modulaire
- Services séparés par domaine
- Composants réutilisables  
- Types TypeScript stricts
- Tests unitaires prêts

### 🆙 Extensibilité
- Nouveaux types d'attributs faciles à ajouter
- Interface plugin-ready
- API RESTful compatible
- Webhook ready pour intégrations

## 📞 Support et maintenance

### 🔧 Commandes utiles
```sql
-- Recalculer tous les chemins hiérarchiques
UPDATE categories SET hierarchy_path = calculate_hierarchy_path(id);

-- Statistiques rapides
SELECT 
  'Catégories' as type, count(*) as total 
FROM categories 
WHERE is_active = true;

-- Nettoyage du cache
-- (Redémarrer l'application ou attendre 30s)
```

### 📋 Checklist de maintenance
- [ ] Vérifier l'intégrité des chemins hiérarchiques
- [ ] Contrôler les attributs orphelins
- [ ] Optimiser les index selon l'usage
- [ ] Surveiller les performances du cache
- [ ] Backup régulier des configurations

---

## ✅ Conformité au Cahier des Charges

### ✅ 1.2.1 Arborescence des Catégories - COMPLET
- ✅ Arborescence infinie
- ✅ Catégorie parente  
- ✅ Ordre d'affichage
- ✅ Activation/Désactivation
- ✅ Icône/Image
- ✅ Chemin hiérarchique automatique

### ✅ 1.2.2 Attributs par Catégorie - COMPLET
- ✅ Attributs obligatoires/optionnels
- ✅ Héritage des attributs
- ✅ Types d'attributs multiples
- ✅ Valeurs prédéfinies

### ✅ 1.2.3 Référencement SEO - COMPLET  
- ✅ Meta Title
- ✅ Meta Description
- ✅ URL personnalisée
- ✅ Texte de présentation
- ✅ Image de bannière
- ✅ Mots-clés SEO

🎉 **Le système de catégories EVA SHOE est maintenant 100% conforme aux spécifications du cahier des charges !**