-- =====================================================
-- MISE À JOUR COMPLÈTE DU SYSTÈME DE CATÉGORIES
-- Conforme au Cahier des Charges Fonctionnel
-- =====================================================

-- =====================================================
-- 1. AJOUT DES CHAMPS SEO MANQUANTS
-- =====================================================

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
ADD COLUMN IF NOT EXISTS presentation_text TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS hierarchy_path TEXT;

-- =====================================================
-- 2. CRÉATION DU SYSTÈME D'ATTRIBUTS
-- =====================================================

-- 2.1 Table des attributs globaux
CREATE TABLE IF NOT EXISTS public.attributes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('text', 'number', 'select', 'multi_select', 'color', 'size')),
  description TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  validation_rules JSONB,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 2.2 Table des valeurs possibles pour les attributs (pour les types select)
CREATE TABLE IF NOT EXISTS public.attribute_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  display_name TEXT NOT NULL,
  color_code TEXT, -- Pour les couleurs
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.3 Table de liaison attributs-catégories
CREATE TABLE IF NOT EXISTS public.category_attributes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT FALSE,
  is_inherited BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, attribute_id)
);

-- 2.4 Table des valeurs d'attributs pour les produits
CREATE TABLE IF NOT EXISTS public.product_attribute_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  attribute_value_id UUID REFERENCES public.attribute_values(id) ON DELETE CASCADE,
  text_value TEXT,
  number_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, attribute_id)
);

-- =====================================================
-- 3. FONCTION POUR CALCULER LE CHEMIN HIÉRARCHIQUE
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_hierarchy_path(category_id UUID)
RETURNS TEXT AS $$
DECLARE
  path TEXT := '';
  current_id UUID := category_id;
  current_name TEXT;
  parent_id UUID;
BEGIN
  -- Boucle pour remonter la hiérarchie
  WHILE current_id IS NOT NULL LOOP
    SELECT name, parent_id INTO current_name, parent_id
    FROM categories 
    WHERE id = current_id;
    
    IF current_name IS NOT NULL THEN
      IF path = '' THEN
        path := current_name;
      ELSE
        path := current_name || ' > ' || path;
      END IF;
    END IF;
    
    current_id := parent_id;
  END LOOP;
  
  RETURN path;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. TRIGGER POUR MISE À JOUR AUTOMATIQUE DU CHEMIN
-- =====================================================

CREATE OR REPLACE FUNCTION update_category_hierarchy_path()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le chemin de la catégorie modifiée
  UPDATE categories 
  SET hierarchy_path = calculate_hierarchy_path(NEW.id)
  WHERE id = NEW.id;
  
  -- Mettre à jour les chemins de toutes les sous-catégories
  WITH RECURSIVE subcategories AS (
    SELECT id FROM categories WHERE parent_id = NEW.id
    UNION ALL
    SELECT c.id FROM categories c
    JOIN subcategories s ON c.parent_id = s.id
  )
  UPDATE categories 
  SET hierarchy_path = calculate_hierarchy_path(id)
  WHERE id IN (SELECT id FROM subcategories);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_hierarchy_path ON categories;
CREATE TRIGGER trigger_update_hierarchy_path
  AFTER INSERT OR UPDATE OF name, parent_id
  ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_category_hierarchy_path();

-- =====================================================
-- 5. FONCTION POUR HÉRITAGE DES ATTRIBUTS
-- =====================================================

CREATE OR REPLACE FUNCTION inherit_parent_attributes(category_id UUID)
RETURNS VOID AS $$
DECLARE
  parent_id UUID;
  attr_record RECORD;
BEGIN
  -- Récupérer l'ID du parent
  SELECT parent_id INTO parent_id FROM categories WHERE id = category_id;
  
  IF parent_id IS NOT NULL THEN
    -- Copier les attributs du parent qui ne sont pas déjà assignés
    FOR attr_record IN 
      SELECT ca.attribute_id, ca.is_required, ca.display_order
      FROM category_attributes ca
      WHERE ca.category_id = parent_id
      AND ca.attribute_id NOT IN (
        SELECT attribute_id 
        FROM category_attributes 
        WHERE category_id = category_id
      )
    LOOP
      INSERT INTO category_attributes (
        category_id, 
        attribute_id, 
        is_required, 
        is_inherited, 
        display_order
      ) VALUES (
        category_id,
        attr_record.attribute_id,
        attr_record.is_required,
        TRUE,
        attr_record.display_order
      );
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. INSERTION DES ATTRIBUTS DE BASE
-- =====================================================

-- Attributs pour tous types de produits
INSERT INTO public.attributes (name, slug, type, description, is_required) VALUES
('Couleur', 'couleur', 'select', 'Couleur principale du produit', true),
('Marque', 'marque', 'text', 'Marque du produit', false),
('Matière', 'matiere', 'text', 'Matière principale du produit', false),
('Prix', 'prix', 'number', 'Prix du produit', true);

-- Attributs spécifiques aux vêtements
INSERT INTO public.attributes (name, slug, type, description, is_required) VALUES
('Taille Vêtement', 'taille-vetement', 'select', 'Taille pour vêtements (XS, S, M, L, XL, XXL)', true),
('Coupe', 'coupe', 'select', 'Type de coupe (Slim, Regular, Large)', false),
('Style', 'style', 'text', 'Style du vêtement', false),
('Longueur', 'longueur', 'select', 'Longueur (Court, Moyen, Long)', false),
('Collection', 'collection', 'text', 'Collection ou saison', false),
('Entretien', 'entretien', 'text', 'Instructions d''entretien', false);

-- Attributs spécifiques aux chaussures
INSERT INTO public.attributes (name, slug, type, description, is_required) VALUES
('Pointure', 'pointure', 'select', 'Pointure des chaussures (35-45)', true),
('Type Chaussure', 'type-chaussure', 'select', 'Type de chaussure (Basket, Talon, Botte, etc.)', false),
('Hauteur Talon', 'hauteur-talon', 'select', 'Hauteur du talon (Plat, Bas, Moyen, Haut)', false);

-- Valeurs pour les couleurs
INSERT INTO public.attribute_values (attribute_id, value, display_name, color_code) 
SELECT 
  a.id,
  v.value,
  v.display_name,
  v.color_code
FROM public.attributes a
CROSS JOIN (VALUES
  ('noir', 'Noir', '#000000'),
  ('blanc', 'Blanc', '#FFFFFF'),
  ('rouge', 'Rouge', '#FF0000'),
  ('bleu', 'Bleu', '#0000FF'),
  ('vert', 'Vert', '#00FF00'),
  ('jaune', 'Jaune', '#FFFF00'),
  ('rose', 'Rose', '#FFC0CB'),
  ('violet', 'Violet', '#8A2BE2'),
  ('orange', 'Orange', '#FFA500'),
  ('gris', 'Gris', '#808080'),
  ('marron', 'Marron', '#A52A2A'),
  ('beige', 'Beige', '#F5F5DC')
) AS v(value, display_name, color_code)
WHERE a.slug = 'couleur';

-- Valeurs pour les tailles vêtements
INSERT INTO public.attribute_values (attribute_id, value, display_name, display_order) 
SELECT 
  a.id,
  v.value,
  v.display_name,
  v.display_order
FROM public.attributes a
CROSS JOIN (VALUES
  ('xs', 'XS', 1),
  ('s', 'S', 2),
  ('m', 'M', 3),
  ('l', 'L', 4),
  ('xl', 'XL', 5),
  ('xxl', 'XXL', 6),
  ('xxxl', 'XXXL', 7)
) AS v(value, display_name, display_order)
WHERE a.slug = 'taille-vetement';

-- Valeurs pour les pointures
INSERT INTO public.attribute_values (attribute_id, value, display_name, display_order) 
SELECT 
  a.id,
  v.value::text,
  v.value::text,
  v.display_order
FROM public.attributes a
CROSS JOIN (
  SELECT 
    generate_series(35, 45) AS value,
    generate_series(1, 11) AS display_order
) AS v
WHERE a.slug = 'pointure';

-- =====================================================
-- 7. CRÉATION DE LA STRUCTURE DE CATÉGORIES DE BASE
-- =====================================================

-- Supprimer les catégories existantes pour repartir proprement
DELETE FROM public.categories;

-- Niveau 0 : Catégories principales
INSERT INTO public.categories (id, name, slug, description, display_order, is_featured, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'VÊTEMENTS', 'vetements', 'Tous les vêtements pour homme, femme et enfant', 1, true, true),
('22222222-2222-2222-2222-222222222222', 'CHAUSSURES', 'chaussures', 'Toutes les chaussures pour homme, femme et enfant', 2, true, true),
('33333333-3333-3333-3333-333333333333', 'ACCESSOIRES', 'accessoires', 'Sacs, bijoux et autres accessoires', 3, true, true);

-- Niveau 1 : Sous-catégories par genre pour VÊTEMENTS
INSERT INTO public.categories (id, name, slug, description, parent_id, display_order, is_active) VALUES
('11111111-1111-1111-1111-111111111112', 'Homme', 'vetements-homme', 'Vêtements pour homme', '11111111-1111-1111-1111-111111111111', 1, true),
('11111111-1111-1111-1111-111111111113', 'Femme', 'vetements-femme', 'Vêtements pour femme', '11111111-1111-1111-1111-111111111111', 2, true),
('11111111-1111-1111-1111-111111111114', 'Enfant', 'vetements-enfant', 'Vêtements pour enfant', '11111111-1111-1111-1111-111111111111', 3, true);

-- Niveau 1 : Sous-catégories par genre pour CHAUSSURES
INSERT INTO public.categories (id, name, slug, description, parent_id, display_order, is_active) VALUES
('22222222-2222-2222-2222-222222222223', 'Homme', 'chaussures-homme', 'Chaussures pour homme', '22222222-2222-2222-2222-222222222222', 1, true),
('22222222-2222-2222-2222-222222222224', 'Femme', 'chaussures-femme', 'Chaussures pour femme', '22222222-2222-2222-2222-222222222222', 2, true),
('22222222-2222-2222-2222-222222222225', 'Enfant', 'chaussures-enfant', 'Chaussures pour enfant', '22222222-2222-2222-2222-222222222222', 3, true);

-- Niveau 1 : Sous-catégories pour ACCESSOIRES
INSERT INTO public.categories (id, name, slug, description, parent_id, display_order, is_active) VALUES
('33333333-3333-3333-3333-333333333334', 'Sacs', 'sacs', 'Sacs à main, sacs à dos, portefeuilles', '33333333-3333-3333-3333-333333333333', 1, true),
('33333333-3333-3333-3333-333333333335', 'Bijoux', 'bijoux', 'Colliers, bracelets, boucles d''oreilles, montres', '33333333-3333-3333-3333-333333333333', 2, true),
('33333333-3333-3333-3333-333333333336', 'Autres', 'accessoires-autres', 'Chapeaux, casquettes, foulards, cravates, lunettes', '33333333-3333-3333-3333-333333333333', 3, true);

-- Niveau 2 : Détail pour Vêtements Homme
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active) VALUES
('Chemises', 'chemises-homme', 'Chemises pour homme', '11111111-1111-1111-1111-111111111112', 1, true),
('Pantalons', 'pantalons-homme', 'Pantalons pour homme', '11111111-1111-1111-1111-111111111112', 2, true),
('Costumes', 'costumes-homme', 'Costumes pour homme', '11111111-1111-1111-1111-111111111112', 3, true),
('T-shirts', 't-shirts-homme', 'T-shirts pour homme', '11111111-1111-1111-1111-111111111112', 4, true),
('Polo', 'polo-homme', 'Polo pour homme', '11111111-1111-1111-1111-111111111112', 5, true),
('Shorts', 'shorts-homme', 'Shorts pour homme', '11111111-1111-1111-1111-111111111112', 6, true),
('Vestes', 'vestes-homme', 'Vestes pour homme', '11111111-1111-1111-1111-111111111112', 7, true),
('Jeans', 'jeans-homme', 'Jeans pour homme', '11111111-1111-1111-1111-111111111112', 8, true),
('Sous-vêtements', 'sous-vetements-homme', 'Sous-vêtements pour homme', '11111111-1111-1111-1111-111111111112', 9, true);

-- Niveau 2 : Détail pour Vêtements Femme
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active) VALUES
('Robes', 'robes-femme', 'Robes pour femme', '11111111-1111-1111-1111-111111111113', 1, true),
('Jupes', 'jupes-femme', 'Jupes pour femme', '11111111-1111-1111-1111-111111111113', 2, true),
('Pantalons', 'pantalons-femme', 'Pantalons pour femme', '11111111-1111-1111-1111-111111111113', 3, true),
('T-shirts', 't-shirts-femme', 'T-shirts pour femme', '11111111-1111-1111-1111-111111111113', 4, true),
('Chemisiers', 'chemisiers-femme', 'Chemisiers pour femme', '11111111-1111-1111-1111-111111111113', 5, true),
('Vestes', 'vestes-femme', 'Vestes pour femme', '11111111-1111-1111-1111-111111111113', 6, true),
('Manteaux', 'manteaux-femme', 'Manteaux pour femme', '11111111-1111-1111-1111-111111111113', 7, true),
('Jeans', 'jeans-femme', 'Jeans pour femme', '11111111-1111-1111-1111-111111111113', 8, true),
('Sous-vêtements', 'sous-vetements-femme', 'Sous-vêtements pour femme', '11111111-1111-1111-1111-111111111113', 9, true),
('Maillots de bain', 'maillots-bain-femme', 'Maillots de bain pour femme', '11111111-1111-1111-1111-111111111113', 10, true);

-- Niveau 2 : Détail pour Vêtements Enfant
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active) VALUES
('Filles (2-12 ans)', 'vetements-filles', 'Vêtements pour filles de 2 à 12 ans', '11111111-1111-1111-1111-111111111114', 1, true),
('Garçons (2-12 ans)', 'vetements-garcons', 'Vêtements pour garçons de 2 à 12 ans', '11111111-1111-1111-1111-111111111114', 2, true),
('Bébé (0-2 ans)', 'vetements-bebe', 'Vêtements pour bébé de 0 à 2 ans', '11111111-1111-1111-1111-111111111114', 3, true);

-- Niveau 2 : Détail pour Chaussures Homme
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active) VALUES
('Baskets', 'baskets-homme', 'Baskets pour homme', '22222222-2222-2222-2222-222222222223', 1, true),
('Derbies', 'derbies-homme', 'Derbies pour homme', '22222222-2222-2222-2222-222222222223', 2, true),
('Mocassins', 'mocassins-homme', 'Mocassins pour homme', '22222222-2222-2222-2222-222222222223', 3, true),
('Sandales', 'sandales-homme', 'Sandales pour homme', '22222222-2222-2222-2222-222222222223', 4, true),
('Bottes', 'bottes-homme', 'Bottes pour homme', '22222222-2222-2222-2222-222222222223', 5, true),
('Chaussures de sport', 'sport-homme', 'Chaussures de sport pour homme', '22222222-2222-2222-2222-222222222223', 6, true);

-- Niveau 2 : Détail pour Chaussures Femme
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active) VALUES
('Baskets', 'baskets-femme', 'Baskets pour femme', '22222222-2222-2222-2222-222222222224', 1, true),
('Escarpins', 'escarpins-femme', 'Escarpins pour femme', '22222222-2222-2222-2222-222222222224', 2, true),
('Sandales à talons', 'sandales-talons-femme', 'Sandales à talons pour femme', '22222222-2222-2222-2222-222222222224', 3, true),
('Ballerines', 'ballerines-femme', 'Ballerines pour femme', '22222222-2222-2222-2222-222222222224', 4, true),
('Bottes', 'bottes-femme', 'Bottes pour femme', '22222222-2222-2222-2222-222222222224', 5, true),
('Chaussures de sport', 'sport-femme', 'Chaussures de sport pour femme', '22222222-2222-2222-2222-222222222224', 6, true);

-- Niveau 2 : Détail pour Chaussures Enfant
INSERT INTO public.categories (name, slug, description, parent_id, display_order, is_active) VALUES
('Filles (2-12 ans)', 'chaussures-filles', 'Chaussures pour filles de 2 à 12 ans', '22222222-2222-2222-2222-222222222225', 1, true),
('Garçons (2-12 ans)', 'chaussures-garcons', 'Chaussures pour garçons de 2 à 12 ans', '22222222-2222-2222-2222-222222222225', 2, true),
('Bébé (0-2 ans)', 'chaussures-bebe', 'Chaussures pour bébé de 0 à 2 ans', '22222222-2222-2222-2222-222222222225', 3, true);

-- =====================================================
-- 8. ATTRIBUTION DES ATTRIBUTS AUX CATÉGORIES
-- =====================================================

-- Attributs pour toutes les catégories de vêtements
INSERT INTO public.category_attributes (category_id, attribute_id, is_required)
SELECT 
  c.id,
  a.id,
  CASE 
    WHEN a.slug IN ('couleur', 'taille-vetement') THEN true
    ELSE false
  END
FROM public.categories c
CROSS JOIN public.attributes a
WHERE c.hierarchy_path LIKE 'VÊTEMENTS%'
AND c.parent_id IS NOT NULL  -- Pas la catégorie racine
AND a.slug IN ('couleur', 'marque', 'matiere', 'taille-vetement', 'coupe', 'style', 'longueur', 'collection', 'entretien');

-- Attributs pour toutes les catégories de chaussures
INSERT INTO public.category_attributes (category_id, attribute_id, is_required)
SELECT 
  c.id,
  a.id,
  CASE 
    WHEN a.slug IN ('couleur', 'pointure') THEN true
    ELSE false
  END
FROM public.categories c
CROSS JOIN public.attributes a
WHERE c.hierarchy_path LIKE 'CHAUSSURES%'
AND c.parent_id IS NOT NULL  -- Pas la catégorie racine
AND a.slug IN ('couleur', 'marque', 'matiere', 'pointure', 'type-chaussure', 'hauteur-talon');

-- Attributs pour les accessoires
INSERT INTO public.category_attributes (category_id, attribute_id, is_required)
SELECT 
  c.id,
  a.id,
  CASE 
    WHEN a.slug = 'couleur' THEN true
    ELSE false
  END
FROM public.categories c
CROSS JOIN public.attributes a
WHERE c.hierarchy_path LIKE 'ACCESSOIRES%'
AND c.parent_id IS NOT NULL  -- Pas la catégorie racine
AND a.slug IN ('couleur', 'marque', 'matiere');

-- =====================================================
-- 9. MISE À JOUR DES CHEMINS HIÉRARCHIQUES
-- =====================================================

-- Mettre à jour tous les chemins hiérarchiques
UPDATE public.categories 
SET hierarchy_path = calculate_hierarchy_path(id);

-- =====================================================
-- 10. INDEX POUR OPTIMISER LES PERFORMANCES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_hierarchy_path ON public.categories USING GIN(hierarchy_path gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_category_attributes_category_id ON public.category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_attribute_values_attribute_id ON public.attribute_values(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attribute_values_product_id ON public.product_attribute_values(product_id);

-- =====================================================
-- FIN DE LA MISE À JOUR
-- =====================================================

-- Afficher un résumé
SELECT 
  'Catégories créées' as type,
  count(*) as count
FROM public.categories
UNION ALL
SELECT 
  'Attributs créés' as type,
  count(*) as count
FROM public.attributes
UNION ALL
SELECT 
  'Liaisons catégorie-attribut créées' as type,
  count(*) as count
FROM public.category_attributes;