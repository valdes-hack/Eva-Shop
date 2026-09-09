-- CATEGORIES-FIXES-IMMEDIATES.sql
-- Corrections immédiates pour le système de catégories

-- 1. Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
ADD COLUMN IF NOT EXISTS presentation_text TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS hierarchy_path TEXT;

-- 2. Corriger la fonction de calcul du chemin hiérarchique
DROP FUNCTION IF EXISTS calculate_hierarchy_path(UUID);

CREATE OR REPLACE FUNCTION calculate_hierarchy_path(category_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    current_id UUID := category_uuid;
    current_name TEXT;
    parent_uuid UUID;
    path_parts TEXT[] := ARRAY[]::TEXT[];
    max_depth INTEGER := 10; -- Protection contre les boucles infinies
    current_depth INTEGER := 0;
BEGIN
    WHILE current_id IS NOT NULL AND current_depth < max_depth LOOP
        SELECT name, parent_id INTO current_name, parent_uuid
        FROM categories WHERE id = current_id;
        
        IF current_name IS NULL THEN
            EXIT;
        END IF;
        
        path_parts := array_prepend(current_name, path_parts);
        current_id := parent_uuid;
        current_depth := current_depth + 1;
    END LOOP;
    
    RETURN array_to_string(path_parts, ' > ');
END;
$$ LANGUAGE plpgsql;

-- 3. Recréer le trigger pour le hierarchy_path
DROP TRIGGER IF EXISTS trigger_update_category_hierarchy_path ON categories;

CREATE OR REPLACE FUNCTION update_category_hierarchy_path()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculer le chemin pour la catégorie modifiée
    NEW.hierarchy_path = calculate_hierarchy_path(NEW.id);
    
    -- Si le parent_id ou le nom a changé, mettre à jour les enfants
    IF TG_OP = 'UPDATE' AND (OLD.parent_id IS DISTINCT FROM NEW.parent_id OR OLD.name IS DISTINCT FROM NEW.name) THEN
        -- Mise à jour en cascade des enfants (fait après l'INSERT/UPDATE)
        -- Cette partie sera exécutée par un trigger AFTER
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_hierarchy_path
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_category_hierarchy_path();

-- 4. Trigger pour mettre à jour les enfants après modification
CREATE OR REPLACE FUNCTION update_children_hierarchy_path()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour récursivement tous les enfants
    WITH RECURSIVE children AS (
        -- Enfants directs
        SELECT id FROM categories WHERE parent_id = NEW.id
        UNION ALL
        -- Enfants des enfants
        SELECT c.id FROM categories c
        INNER JOIN children ch ON c.parent_id = ch.id
    )
    UPDATE categories 
    SET hierarchy_path = calculate_hierarchy_path(id)
    WHERE id IN (SELECT id FROM children);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_children_hierarchy ON categories;
CREATE TRIGGER trigger_update_children_hierarchy
    AFTER INSERT OR UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_children_hierarchy_path();

-- 5. Mettre à jour tous les hierarchy_path existants
UPDATE categories 
SET hierarchy_path = calculate_hierarchy_path(id)
WHERE hierarchy_path IS NULL OR hierarchy_path = '';

-- 6. Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_categories_hierarchy_path ON categories(hierarchy_path);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_categories_search ON categories USING gin(to_tsvector('french', name || ' ' || COALESCE(description, '')));

-- 7. Ajouter quelques catégories de test si la table est vide (optionnel)
INSERT INTO categories (name, slug, icon, display_order, is_active, is_featured, description)
SELECT * FROM (VALUES
    ('Vêtements', 'vetements', 'shirt', 1, true, true, 'Collection complète de vêtements pour toute la famille'),
    ('Chaussures', 'chaussures', 'shoe', 2, true, true, 'Chaussures tendance et confortables'),
    ('Accessoires', 'accessoires', 'bag', 3, true, true, 'Accessoires de mode et bijoux')
) AS new_categories(name, slug, icon, display_order, is_active, is_featured, description)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug IN ('vetements', 'chaussures', 'accessoires'));

-- 8. Statistiques finales
DO $$
DECLARE
    total_count INTEGER;
    active_count INTEGER;
    with_hierarchy INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM categories;
    SELECT COUNT(*) INTO active_count FROM categories WHERE is_active = true;
    SELECT COUNT(*) INTO with_hierarchy FROM categories WHERE hierarchy_path IS NOT NULL AND hierarchy_path != '';
    
    RAISE NOTICE '✅ Migration terminée:';
    RAISE NOTICE '   - Total catégories: %', total_count;
    RAISE NOTICE '   - Catégories actives: %', active_count;
    RAISE NOTICE '   - Avec hierarchy_path: %', with_hierarchy;
END $$;

COMMIT;