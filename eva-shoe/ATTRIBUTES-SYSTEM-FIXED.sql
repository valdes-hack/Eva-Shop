-- ATTRIBUTES-SYSTEM-FIXED.sql
-- Version corrigée du système d'attributs pour EVA SHOE

-- =====================================================
-- CRÉATION DES TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS attribute_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    options JSONB,
    validation_rules JSONB,
    display_config JSONB,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS category_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attribute_types(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT false,
    is_inherited BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT true,
    is_visible_in_list BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    display_name VARCHAR(100),
    category_config JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(category_id, attribute_id)
);

CREATE TABLE IF NOT EXISTS product_attributes (
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

-- =====================================================
-- INDEX POUR PERFORMANCES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_attribute_types_slug ON attribute_types(slug);
CREATE INDEX IF NOT EXISTS idx_attribute_types_type ON attribute_types(type);
CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_attribute ON category_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);

-- =====================================================
-- INSERTION DES ATTRIBUTS DE BASE
-- =====================================================

-- Couleur (universelle)
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Couleur', 'couleur', 'color', 
 '{"values": ["Rouge", "Bleu", "Vert", "Noir", "Blanc", "Gris", "Marron", "Rose", "Violet", "Orange", "Jaune"], "allow_custom": true}',
 '{"required": true}',
 'Couleur principale du produit', true)
ON CONFLICT (slug) DO NOTHING;

-- Marque (universelle)
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Marque', 'marque', 'select',
 '{"values": ["Nike", "Adidas", "Puma", "Reebok", "Converse", "Vans", "New Balance", "Jordan", "Zara", "H&M", "Local"], "allow_custom": true}',
 '{"required": false}',
 'Marque du produit', true)
ON CONFLICT (slug) DO NOTHING;

-- Matière (universelle)
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Matiere', 'matiere', 'select',
 '{"values": ["Coton", "Polyester", "Cuir", "Daim", "Toile", "Denim", "Laine", "Soie", "Lin", "Synthetique"], "allow_custom": true}',
 '{"required": false}',
 'Matière principale du produit', true)
ON CONFLICT (slug) DO NOTHING;

-- Taille vêtement
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Taille Vetement', 'taille-vetement', 'select',
 '{"values": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], "size_chart": "clothing"}',
 '{"required": true}',
 'Taille pour vêtements (XS à XXXL)', true)
ON CONFLICT (slug) DO NOTHING;

-- Pointure
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Pointure', 'pointure', 'select',
 '{"values": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"], "numeric": true}',
 '{"required": true, "min": 35, "max": 45}',
 'Pointure des chaussures (35-45)', true)
ON CONFLICT (slug) DO NOTHING;

-- Coupe (vêtements)
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Coupe', 'coupe', 'select',
 '{"values": ["Slim", "Regular", "Loose", "Oversize", "Skinny", "Bootcut", "Straight"], "allow_custom": false}',
 '{"required": false}',
 'Type de coupe du vêtement', true)
ON CONFLICT (slug) DO NOTHING;

-- Style
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Style', 'style', 'select',
 '{"values": ["Casual", "Formel", "Sport", "Chic", "Vintage", "Moderne", "Classique"], "allow_custom": true}',
 '{"required": false}',
 'Style du vêtement', true)
ON CONFLICT (slug) DO NOTHING;

-- Type chaussure
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Type Chaussure', 'type-chaussure', 'select',
 '{"values": ["Baskets", "Sandales", "Escarpins", "Bottes", "Mocassins", "Derbies", "Ballerines"], "allow_custom": false}',
 '{"required": false}',
 'Type de chaussure', true)
ON CONFLICT (slug) DO NOTHING;

-- Type accessoire
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
('Type Accessoire', 'type-accessoire', 'select',
 '{"values": ["Sac à main", "Sac à dos", "Portefeuille", "Ceinture", "Montre", "Collier", "Bracelet", "Boucles oreilles"], "allow_custom": true}',
 '{"required": false}',
 'Type accessoire', true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- CONFIGURATION AUTOMATIQUE PAR CATÉGORIE
-- =====================================================

-- Attribution pour la catégorie Vêtements
DO $$
DECLARE
    vetements_id UUID;
    couleur_id UUID;
    taille_id UUID;
    marque_id UUID;
    matiere_id UUID;
    coupe_id UUID;
    style_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO vetements_id FROM categories WHERE slug = 'vetements' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    SELECT id INTO taille_id FROM attribute_types WHERE slug = 'taille-vetement' LIMIT 1;
    SELECT id INTO marque_id FROM attribute_types WHERE slug = 'marque' LIMIT 1;
    SELECT id INTO matiere_id FROM attribute_types WHERE slug = 'matiere' LIMIT 1;
    SELECT id INTO coupe_id FROM attribute_types WHERE slug = 'coupe' LIMIT 1;
    SELECT id INTO style_id FROM attribute_types WHERE slug = 'style' LIMIT 1;
    
    -- Attribution des attributs si la catégorie existe
    IF vetements_id IS NOT NULL THEN
        -- Attributs obligatoires
        IF taille_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (vetements_id, taille_id, true, true, 1)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF couleur_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (vetements_id, couleur_id, true, true, 2)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        -- Attributs optionnels
        IF marque_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (vetements_id, marque_id, false, true, 3)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF matiere_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (vetements_id, matiere_id, false, true, 4)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF coupe_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (vetements_id, coupe_id, false, true, 5)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF style_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (vetements_id, style_id, false, true, 6)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
    END IF;
END $$;

-- Attribution pour la catégorie Chaussures
DO $$
DECLARE
    chaussures_id UUID;
    pointure_id UUID;
    couleur_id UUID;
    marque_id UUID;
    matiere_id UUID;
    type_chaussure_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO chaussures_id FROM categories WHERE slug = 'chaussures' LIMIT 1;
    SELECT id INTO pointure_id FROM attribute_types WHERE slug = 'pointure' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    SELECT id INTO marque_id FROM attribute_types WHERE slug = 'marque' LIMIT 1;
    SELECT id INTO matiere_id FROM attribute_types WHERE slug = 'matiere' LIMIT 1;
    SELECT id INTO type_chaussure_id FROM attribute_types WHERE slug = 'type-chaussure' LIMIT 1;
    
    -- Attribution des attributs si la catégorie existe
    IF chaussures_id IS NOT NULL THEN
        -- Attributs obligatoires
        IF pointure_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (chaussures_id, pointure_id, true, true, 1)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF couleur_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (chaussures_id, couleur_id, true, true, 2)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        -- Attributs optionnels
        IF marque_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (chaussures_id, marque_id, false, true, 3)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF matiere_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (chaussures_id, matiere_id, false, true, 4)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF type_chaussure_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (chaussures_id, type_chaussure_id, false, true, 5)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
    END IF;
END $$;

-- Attribution pour la catégorie Accessoires
DO $$
DECLARE
    accessoires_id UUID;
    couleur_id UUID;
    marque_id UUID;
    matiere_id UUID;
    type_accessoire_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO accessoires_id FROM categories WHERE slug = 'accessoires' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    SELECT id INTO marque_id FROM attribute_types WHERE slug = 'marque' LIMIT 1;
    SELECT id INTO matiere_id FROM attribute_types WHERE slug = 'matiere' LIMIT 1;
    SELECT id INTO type_accessoire_id FROM attribute_types WHERE slug = 'type-accessoire' LIMIT 1;
    
    -- Attribution des attributs si la catégorie existe
    IF accessoires_id IS NOT NULL THEN
        -- Attributs obligatoires
        IF couleur_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (accessoires_id, couleur_id, true, true, 1)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        -- Attributs optionnels
        IF type_accessoire_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (accessoires_id, type_accessoire_id, false, true, 2)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF marque_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (accessoires_id, marque_id, false, true, 3)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        IF matiere_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (accessoires_id, matiere_id, false, true, 4)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
    END IF;
END $$;

-- =====================================================
-- STATISTIQUES FINALES
-- =====================================================
DO $$
DECLARE
    attr_count INTEGER;
    config_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO attr_count FROM attribute_types;
    SELECT COUNT(*) INTO config_count FROM category_attributes;
    
    RAISE NOTICE '✅ Système attributs installé:';
    RAISE NOTICE '   - Types attributs: %', attr_count;
    RAISE NOTICE '   - Configurations: %', config_count;
END $$;