-- ATTRIBUTES-SIMPLE-CREATE.sql
-- Version ultra-simple pour créer les tables d'attributs pas à pas

-- =====================================================
-- ÉTAPE 1: CRÉER LA TABLE products SI MANQUANTE
-- =====================================================
-- (Nécessaire pour les foreign keys)

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ÉTAPE 2: CRÉER LA TABLE attribute_types
-- =====================================================

DROP TABLE IF EXISTS attribute_types CASCADE;

CREATE TABLE attribute_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    options JSONB DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

RAISE NOTICE '✅ Table attribute_types créée';

-- =====================================================
-- ÉTAPE 3: CRÉER LA TABLE category_attributes  
-- =====================================================

DROP TABLE IF EXISTS category_attributes CASCADE;

CREATE TABLE category_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attribute_types(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    display_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(category_id, attribute_id)
);

RAISE NOTICE '✅ Table category_attributes créée';

-- =====================================================
-- ÉTAPE 4: CRÉER LA TABLE product_attributes
-- =====================================================

DROP TABLE IF EXISTS product_attributes CASCADE;

CREATE TABLE product_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attribute_types(id) ON DELETE CASCADE,
    text_value TEXT,
    number_value DECIMAL(10,2),
    json_value JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id, attribute_id)
);

RAISE NOTICE '✅ Table product_attributes créée';

-- =====================================================
-- ÉTAPE 5: CRÉER LES INDEX DE BASE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_attribute_types_slug ON attribute_types(slug);
CREATE INDEX IF NOT EXISTS idx_attribute_types_active ON attribute_types(is_active);
CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_attribute ON category_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);

RAISE NOTICE '✅ Index créés';

-- =====================================================
-- ÉTAPE 6: INSÉRER LES DONNÉES DE BASE
-- =====================================================

-- Insérer les 5 attributs essentiels
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Couleur', 'couleur', 'select', 
 '{"values": ["Rouge", "Bleu", "Vert", "Noir", "Blanc", "Gris", "Marron", "Rose", "Violet", "Orange", "Jaune"]}',
 '{"required": true}', 'Couleur principale', true),
 
('Marque', 'marque', 'select',
 '{"values": ["Nike", "Adidas", "Puma", "Reebok", "Converse", "Vans", "New Balance", "Jordan", "Zara", "H&M", "Local"]}',
 '{"required": false}', 'Marque du produit', true),
 
('Matiere', 'matiere', 'select',
 '{"values": ["Coton", "Polyester", "Cuir", "Daim", "Toile", "Denim", "Laine", "Soie", "Lin"]}',
 '{"required": false}', 'Matière principale', true),
 
('Taille', 'taille', 'select',
 '{"values": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]}',
 '{"required": true}', 'Taille vêtements', true),
 
('Pointure', 'pointure', 'select',
 '{"values": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]}',
 '{"required": true}', 'Pointure chaussures', true);

RAISE NOTICE '✅ 5 types d''attributs insérés';

-- =====================================================
-- ÉTAPE 7: CONFIGURATION DES CATÉGORIES
-- =====================================================

-- Configuration simple pour les catégories existantes
DO $$
DECLARE
    cat_record RECORD;
    attr_couleur_id UUID;
    attr_taille_id UUID;
    attr_pointure_id UUID;
BEGIN
    -- Récupérer les IDs des attributs
    SELECT id INTO attr_couleur_id FROM attribute_types WHERE slug = 'couleur';
    SELECT id INTO attr_taille_id FROM attribute_types WHERE slug = 'taille';
    SELECT id INTO attr_pointure_id FROM attribute_types WHERE slug = 'pointure';
    
    -- Pour chaque catégorie, ajouter les attributs appropriés
    FOR cat_record IN SELECT id, name, slug FROM categories WHERE is_active = true LOOP
        RAISE NOTICE 'Configuration de la catégorie: % (%)', cat_record.name, cat_record.slug;
        
        -- Couleur pour toutes les catégories
        IF attr_couleur_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (cat_record.id, attr_couleur_id, true, true, 1)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        -- Taille pour les vêtements
        IF cat_record.slug ILIKE '%vetement%' OR cat_record.slug ILIKE '%shirt%' OR cat_record.slug ILIKE '%robe%' THEN
            IF attr_taille_id IS NOT NULL THEN
                INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
                VALUES (cat_record.id, attr_taille_id, true, true, 2)
                ON CONFLICT (category_id, attribute_id) DO NOTHING;
            END IF;
        END IF;
        
        -- Pointure pour les chaussures
        IF cat_record.slug ILIKE '%chaussure%' OR cat_record.slug ILIKE '%basket%' OR cat_record.slug ILIKE '%sandal%' THEN
            IF attr_pointure_id IS NOT NULL THEN
                INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
                VALUES (cat_record.id, attr_pointure_id, true, true, 2)
                ON CONFLICT (category_id, attribute_id) DO NOTHING;
            END IF;
        END IF;
        
    END LOOP;
END $$;

-- =====================================================
-- ÉTAPE 8: ACTIVER RLS ET PERMISSIONS
-- =====================================================

-- Activer RLS
ALTER TABLE attribute_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
CREATE POLICY "Lecture publique attribute_types" ON attribute_types FOR SELECT USING (is_active = true);
CREATE POLICY "Lecture publique category_attributes" ON category_attributes FOR SELECT USING (true);
CREATE POLICY "Lecture publique product_attributes" ON product_attributes FOR SELECT USING (true);

-- Politiques d'administration
CREATE POLICY "Admin attribute_types" ON attribute_types FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin category_attributes" ON category_attributes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin product_attributes" ON product_attributes FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RÉSUMÉ FINAL
-- =====================================================
DO $$
DECLARE
    attr_count INTEGER;
    config_count INTEGER;
    categories_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO attr_count FROM attribute_types;
    SELECT COUNT(*) INTO config_count FROM category_attributes;
    SELECT COUNT(DISTINCT category_id) INTO categories_count FROM category_attributes;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !';
    RAISE NOTICE '=====================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Résumé final:';
    RAISE NOTICE '  - Tables créées: ✅ attribute_types, category_attributes, product_attributes';
    RAISE NOTICE '  - Types d''attributs: % (Couleur, Marque, Matiere, Taille, Pointure)', attr_count;
    RAISE NOTICE '  - Configurations: % attributions aux catégories', config_count;
    RAISE NOTICE '  - Catégories configurées: %', categories_count;
    RAISE NOTICE '  - RLS activé: ✅ Tables exposées via API Supabase';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Test maintenant:';
    RAISE NOTICE '  1. Rafraîchir la page web';
    RAISE NOTICE '  2. Aller dans l''onglet Attributs d''une catégorie';
    RAISE NOTICE '  3. Visiter /categories/attributs';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Le système d''attributs est opérationnel !';
END $$;