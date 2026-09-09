# Design Technique - Système de Catégories Complet

## 🏗️ Architecture de la Solution

### Phase 1: Fixes Critiques (Priorité 1)

#### 1.1 Service de Catégories Optimisé
```typescript
// src/lib/services/category-optimized.service.ts
export interface CategoryService {
  // CRUD de base avec cache intelligent
  getCategories(filters?: CategoryFilters): Promise<{ data: Category[], count: number }>
  getCategoryHierarchy(): Promise<Category[]>
  getCategoryWithAttributes(id: string): Promise<Category | null>
  updateCategory(id: string, data: CategoryFormData): Promise<Category>
  deleteCategory(id: string): Promise<void>
  
  // Actions en lot
  bulkUpdateCategories(ids: string[], updates: Partial<CategoryFormData>): Promise<void>
  
  // Cache et invalidation
  invalidateCache(): void
}
```

#### 1.2 Hook de Filtres Corrigé
```typescript
// src/lib/hooks/use-categories-filters.ts
export interface CategoriesFiltersHook {
  // État des filtres
  filters: CategoryFilters
  debouncedSearch: string
  apiFilters: CategoryFilters
  
  // Actions
  updateSearch(search: string): void
  updateStatus(status: boolean | null): void
  updateParent(parentId: string | null): void
  updateSort(field: string, direction: 'asc' | 'desc'): void
  updatePage(page: number): void
  clearFilters(): void
  
  // État de chargement
  isLoading: boolean
}
```

#### 1.3 Composant de Tableau Réactif
```typescript
// src/components/dashboard/categories/categories-data-table-fixed.tsx
interface CategoriesDataTableProps {
  refreshTrigger?: number
  filters: CategoryFilters
  filtersHook: CategoriesFiltersHook
  onRefresh: () => void
}

// Fonctionnalités clés:
// - Mise à jour en temps réel des filtres
// - Actions visibles (modification, suppression)
// - Sélection multiple pour actions en lot
// - Pagination fonctionnelle
// - Cache intelligent
```

### Phase 2: Formulaire avec Icônes SVG (Priorité 2)

#### 2.1 Composant d'Icônes SVG
```typescript
// src/components/ui/category-icons.tsx
export interface CategoryIcon {
  value: string
  label: string
  svg: React.ReactNode
  category?: string[]  // Catégories suggérées
}

export const CATEGORY_ICONS: CategoryIcon[] = [
  {
    value: 'folder',
    label: 'Dossier',
    svg: <FolderIcon />,
    category: ['general']
  },
  {
    value: 'shoe',
    label: 'Chaussures', 
    svg: <ShoeIcon />,
    category: ['chaussures', 'baskets', 'sandales']
  },
  // ... autres icônes
]
```

#### 2.2 Formulaire Multi-Onglets Complet
```typescript
// src/components/dashboard/categories/category-form-complete.tsx
interface CategoryFormCompleteProps {
  categoryId?: string
  onSuccess?: (category: Category) => void
  onCancel?: () => void
}

// Onglets:
// - Général: nom, slug, description, parent, images, icône
// - SEO: meta_title, meta_description, seo_keywords, presentation_text
// - Attributs: gestion des attributs avec héritage
// - Aperçu: prévisualisation de la catégorie
```

### Phase 3: Gestion des Attributs (Priorité 3)

#### 3.1 Service des Attributs
```typescript
// src/lib/services/category-attributes.service.ts
export interface CategoryAttributesService {
  // Gestion des types d'attributs
  getAttributeTypes(): Promise<AttributeType[]>
  createAttributeType(data: AttributeTypeFormData): Promise<AttributeType>
  
  // Attribution aux catégories
  assignAttributeToCategory(categoryId: string, attributeId: string, config: AttributeConfig): Promise<void>
  getCategoryAttributes(categoryId: string, includeInherited: boolean): Promise<CategoryAttribute[]>
  
  // Héritage automatique
  getInheritedAttributes(categoryId: string): Promise<CategoryAttribute[]>
  updateAttributeInheritance(categoryId: string): Promise<void>
}
```

#### 3.2 Types d'Attributs Prédéfinis
```typescript
// Configuration selon le CdCF
const PREDEFINED_ATTRIBUTES = {
  'vetements': {
    required: ['taille', 'couleur'],
    optional: ['marque', 'matiere', 'collection', 'entretien']
  },
  'vetements-homme': {
    required: ['taille', 'couleur'],
    optional: ['marque', 'matiere', 'coupe', 'style']
  },
  'chaussures': {
    required: ['pointure', 'couleur'],
    optional: ['marque', 'matiere', 'type']
  },
  // ... autres catégories
}
```

## 🗄️ Structure de la Base de Données

### Tables Existantes Optimisées

#### 1. Table `categories` (Améliorée)
```sql
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
ADD COLUMN IF NOT EXISTS presentation_text TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS hierarchy_path TEXT;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_categories_hierarchy_path ON categories(hierarchy_path);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
```

#### 2. Nouvelles Tables pour les Attributs
```sql
-- Types d'attributs disponibles
CREATE TABLE IF NOT EXISTS attribute_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'text', 'number', 'select', 'multiselect', 'boolean'
    options JSONB, -- Pour les select/multiselect
    validation_rules JSONB,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Attribution des attributs aux catégories
CREATE TABLE IF NOT EXISTS category_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    attribute_id UUID REFERENCES attribute_types(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT false,
    is_inherited BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    configuration JSONB, -- Configuration spécifique (valeurs par défaut, etc.)
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(category_id, attribute_id)
);
```

### Triggers et Fonctions

#### 1. Calcul Automatique du Chemin Hiérarchique
```sql
-- Fonction pour calculer le chemin hiérarchique
CREATE OR REPLACE FUNCTION calculate_hierarchy_path(category_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    current_id UUID := category_uuid;
    current_name TEXT;
    parent_uuid UUID;
    path_parts TEXT[] := ARRAY[]::TEXT[];
BEGIN
    WHILE current_id IS NOT NULL LOOP
        SELECT name, parent_id INTO current_name, parent_uuid
        FROM categories WHERE id = current_id;
        
        IF current_name IS NULL THEN
            EXIT;
        END IF;
        
        path_parts := array_prepend(current_name, path_parts);
        current_id := parent_uuid;
    END LOOP;
    
    RETURN array_to_string(path_parts, ' > ');
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le hierarchy_path
CREATE OR REPLACE FUNCTION update_category_hierarchy_path()
RETURNS TRIGGER AS $$
BEGIN
    NEW.hierarchy_path = calculate_hierarchy_path(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_category_hierarchy_path ON categories;
CREATE TRIGGER trigger_update_category_hierarchy_path
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_category_hierarchy_path();
```

#### 2. Héritage Automatique des Attributs
```sql
-- Fonction pour propager les attributs aux sous-catégories
CREATE OR REPLACE FUNCTION propagate_attributes_to_children()
RETURNS TRIGGER AS $$
BEGIN
    -- Ajouter les nouveaux attributs aux sous-catégories
    INSERT INTO category_attributes (category_id, attribute_id, is_required, is_inherited, display_order)
    SELECT 
        c.id,
        NEW.attribute_id,
        NEW.is_required,
        true, -- Marqué comme hérité
        NEW.display_order
    FROM categories c
    WHERE c.parent_id = NEW.category_id
    ON CONFLICT (category_id, attribute_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_propagate_attributes
    AFTER INSERT ON category_attributes
    FOR EACH ROW
    EXECUTE FUNCTION propagate_attributes_to_children();
```

## 🎨 Composants UI Améliorés

### 1. Sélecteur d'Icônes Visuel
```typescript
// src/components/ui/icon-selector.tsx
interface IconSelectorProps {
  value: string
  onChange: (iconValue: string) => void
  suggestions?: string[] // Icônes suggérées selon la catégorie
}

// Features:
// - Grille visuelle d'icônes SVG
// - Recherche par nom d'icône  
// - Suggestions contextuelles
// - Aperçu en temps réel
```

### 2. Gestionnaire d'Attributs par Catégorie
```typescript
// src/components/dashboard/categories/category-attributes-manager.tsx
interface CategoryAttributesManagerProps {
  categoryId: string
  attributes: CategoryAttribute[]
  onAttributesChange: (attributes: CategoryAttribute[]) => void
}

// Features:
// - Liste des attributs assignés
// - Indication hérité/direct
// - Ajout/suppression d'attributs
// - Configuration obligatoire/optionnel
// - Prévisualisation du formulaire produit
```

### 3. Tableau avec Actions Complètes
```typescript
// src/components/dashboard/categories/categories-table-enhanced.tsx
// Features:
// - Sélection multiple avec checkbox
// - Actions en lot (activer, désactiver, supprimer)
// - Tri par glisser-déposer
// - Filtres temps réel
// - Pagination intelligente
// - Export CSV
```

## 🔄 Flux de Données Optimisé

### 1. Cache Multi-Niveaux
```typescript
// Cache Strategy:
// L1: React Query (mémoire, 5min)
// L2: Session Storage (navigation, 1h)  
// L3: Supabase (base de données)

const useCategoriesQuery = (filters: CategoryFilters) => {
  return useQuery({
    queryKey: ['categories', filters],
    queryFn: () => getCategoriesWithCache(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

### 2. Invalidation Intelligente
```typescript
// Invalidation après mutations:
// - Création: invalide ['categories'] + ['categories-stats']
// - Modification: invalide ['categories', id] + ['categories']  
// - Suppression: invalide ['categories'] + ['categories-stats']
// - Changement hiérarchie: invalide ['categories-hierarchy']

const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      // Invalidation ciblée
      queryClient.invalidateQueries(['categories'])
      queryClient.invalidateQueries(['categories', data.id])
      queryClient.invalidateQueries(['categories-stats'])
      
      // Mise à jour optimiste
      queryClient.setQueryData(['categories', data.id], data)
    }
  })
}
```

## 📱 Interface Mobile-First

### 1. Responsive Breakpoints
```scss
// Tailwind config customisé
screens: {
  'xs': '475px',
  'sm': '640px', 
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
}
```

### 2. Composants Adaptatifs
```typescript
// Desktop: Tableau complet
// Tablet: Tableau simplifié  
// Mobile: Liste avec cartes

const CategoriesView = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  
  if (isMobile) return <CategoriesMobileList />
  if (isTablet) return <CategoriesTabletTable />
  return <CategoriesDesktopTable />
}
```

## ⚡ Performances et SEO

### 1. Optimisations Frontend
- **Code splitting** par route et composant
- **Lazy loading** des images et composants lourds
- **Virtual scrolling** pour de grandes listes
- **Debounce** sur les recherches (300ms)
- **Memoization** des calculs coûteux

### 2. Optimisations Backend  
- **Index composites** sur les colonnes fréquemment filtrées
- **Pagination cursor-based** pour de meilleures performances
- **Agrégation** des statistiques en temps réel
- **Compression gzip** des réponses API

### 3. SEO et Accessibilité
- **Meta tags dynamiques** par catégorie
- **Schema.org markup** pour les catégories  
- **ARIA labels** sur tous les contrôles
- **Navigation clavier** complète
- **Contraste suffisant** (WCAG AA)

## 🧪 Plan de Tests

### 1. Tests Unitaires
- Services de catégories
- Hooks de filtres
- Utilitaires de validation
- Composants isolés

### 2. Tests d'Intégration  
- Flux complet création/modification
- Filtres et pagination
- Actions en lot
- Cache et invalidation

### 3. Tests E2E
- Scénarios utilisateur complets
- Performance sous charge
- Compatibilité navigateurs
- Accessibilité

## 🚀 Plan de Déploiement

### Phase 1: Fixes Critiques (Aujourd'hui)
- [ ] Corriger les filtres 
- [ ] Restaurer les actions de suppression
- [ ] Formulaire avec icônes SVG fonctionnel

### Phase 2: Améliorations UX (Demain)  
- [ ] Interface de gestion des attributs
- [ ] Actions en lot
- [ ] Cache optimisé

### Phase 3: Fonctionnalités Avancées (Cette semaine)
- [ ] Glisser-déposer pour réorganiser
- [ ] Export/import des catégories
- [ ] Analytics et rapports

Cette architecture garantit un système robuste, performant et évolutif qui répond à tous tes besoins actuels et futurs ! 🎯