-- ATTRIBUTES-SAFE-INSTALL.sql
-- Installation sécurisée qui vérifie l'existant avant d'ajouter

-- =====================================================
-- ÉTAPE 1: VÉRIFIER ET CRÉER LES TABLES DE BASE
-- =====================================================

-- Table attribute_types (création sécurisée)
DO $$
BEGIN
    -- Créer la table si elle n'existe pas
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'attribute_types') THEN
        CREATE TABLE attribute_types (
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
        RAISE NOTICE 'Table attribute_types créée';
    ELSE
        RAISE NOTICE 'Table attribute_types existe déjà';
    END IF;
END $$;

-- Table category_attributes (création sécurisée avec toutes les colonnes)
DO $$
BEGIN
    -- Créer la table si elle n'existe pas
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'category_attributes') THEN
        CREATE TABLE category_attributes (
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
        RAISE NOTICE 'Table category_attributes créée avec toutes les colonnes';
    ELSE
        RAISE NOTICE 'Table category_attributes existe, vérification des colonnes...';
        
        -- Ajouter les colonnes manquantes une par une
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT false;
            RAISE NOTICE 'Colonne is_required ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne is_required déjà présente';
        END;
        
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS is_inherited BOOLEAN DEFAULT false;
            RAISE NOTICE 'Colonne is_inherited ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne is_inherited déjà présente';
        END;
        
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS is_filterable BOOLEAN DEFAULT true;
            RAISE NOTICE 'Colonne is_filterable ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne is_filterable déjà présente';
        END;
        
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS is_visible_in_list BOOLEAN DEFAULT true;
            RAISE NOTICE 'Colonne is_visible_in_list ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne is_visible_in_list déjà présente';
        END;
        
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
            RAISE NOTICE 'Colonne display_order ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne display_order déjà présente';
        END;
        
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);
            RAISE NOTICE 'Colonne display_name ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne display_name déjà présente';
        END;
        
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS category_config JSONB;
            RAISE NOTICE 'Colonne category_config ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne category_config déjà présente';
        END;
        
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
            RAISE NOTICE 'Colonne created_at ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne created_at déjà présente';
        END;
        
        BEGIN
            ALTER TABLE category_attributes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
            RAISE NOTICE 'Colonne updated_at ajoutée/vérifiée';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Colonne updated_at déjà présente';
        END;
    END IF;
END $$;

-- Table product_attributes (création sécurisée)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_attributes') THEN
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
        RAISE NOTICE 'Table product_attributes créée';
    ELSE
        RAISE NOTICE 'Table product_attributes existe déjà';
    END IF;
END $$;

-- =====================================================
-- ÉTAPE 2: CRÉER LES INDEX
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_attribute_types_slug ON attribute_types(slug);
CREATE INDEX IF NOT EXISTS idx_attribute_types_type ON attribute_types(type);
CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_attribute ON category_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);

-- =====================================================
-- ÉTAPE 3: INSÉRER LES ATTRIBUTS DE BASE
-- =====================================================

-- Couleur
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) 
VALUES ('Couleur', 'couleur', 'color', 
        '{"values": ["Rouge", "Bleu", "Vert", "Noir", "Blanc", "Gris", "Marron", "Rose", "Violet", "Orange", "Jaune"], "allow_custom": true}',
        '{"required": true}',
        'Couleur principale du produit', true)
ON CONFLICT (slug) DO NOTHING;

-- Marque
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system)
VALUES ('Marque', 'marque', 'select',
        '{"values": ["Nike", "Adidas", "Puma", "Reebok", "Converse", "Vans", "New Balance", "Jordan", "Zara", "H&M", "Local"], "allow_custom": true}',
        '{"required": false}',
        'Marque du produit', true)
ON CONFLICT (slug) DO NOTHING;

-- Matière
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system)
VALUES ('Matiere', 'matiere', 'select',
        '{"values": ["Coton", "Polyester", "Cuir", "Daim", "Toile", "Denim", "Laine", "Soie", "Lin", "Synthetique"], "allow_custom": true}',
        '{"required": false}',
        'Matière principale du produit', true)
ON CONFLICT (slug) DO NOTHING;

-- Taille vêtement
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system)
VALUES ('Taille Vetement', 'taille-vetement', 'select',
        '{"values": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], "size_chart": "clothing"}',
        '{"required": true}',
        'Taille pour vêtements', true)
ON CONFLICT (slug) DO NOTHING;

-- Pointure
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system)
VALUES ('Pointure', 'pointure', 'select',
        '{"values": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"], "numeric": true}',
        '{"required": true, "min": 35, "max": 45}',
        'Pointure des chaussures', true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ÉTAPE 4: ATTRIBUTION AUX CATÉGORIES (Version simplifiée)
-- =====================================================

-- Pour Vêtements (si existe)
DO $$
DECLARE
    vetements_id UUID;
    couleur_id UUID;
    taille_id UUID;
BEGIN
    SELECT id INTO vetements_id FROM categories WHERE slug = 'vetements' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    SELECT id INTO taille_id FROM attribute_types WHERE slug = 'taille-vetement' LIMIT 1;
    
    IF vetements_id IS NOT NULL AND taille_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        VALUES (vetements_id, taille_id, true, true, 1)
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        RAISE NOTICE 'Taille ajoutée à Vêtements';
    END IF;
    
    IF vetements_id IS NOT NULL AND couleur_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        VALUES (vetements_id, couleur_id, true, true, 2)
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        RAISE NOTICE 'Couleur ajoutée à Vêtements';
    END IF;
END $$;

-- Pour Chaussures (si existe)
DO $$
DECLARE
    chaussures_id UUID;
    couleur_id UUID;
    pointure_id UUID;
BEGIN
    SELECT id INTO chaussures_id FROM categories WHERE slug = 'chaussures' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    SELECT id INTO pointure_id FROM attribute_types WHERE slug = 'pointure' LIMIT 1;
    
    IF chaussures_id IS NOT NULL AND pointure_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        VALUES (chaussures_id, pointure_id, true, true, 1)
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        RAISE NOTICE 'Pointure ajoutée à Chaussures';
    END IF;
    
    IF chaussures_id IS NOT NULL AND couleur_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        VALUES (chaussures_id, couleur_id, true, true, 2)
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        RAISE NOTICE 'Couleur ajoutée à Chaussures';
    END IF;
END $$;

-- Pour Accessoires (si existe)
DO $$
DECLARE
    accessoires_id UUID;
    couleur_id UUID;
BEGIN
    SELECT id INTO accessoires_id FROM categories WHERE slug = 'accessoires' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    
    IF accessoires_id IS NOT NULL AND couleur_id IS NOT NULL THEN
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        VALUES (accessoires_id, couleur_id, true, true, 1)
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        RAISE NOTICE 'Couleur ajoutée à Accessoires';
    END IF;
END $$;

-- =====================================================
-- RÉSUMÉ FINAL
-- =====================================================
DO $$
DECLARE
    attr_count INTEGER;
    config_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO attr_count FROM attribute_types WHERE is_system = true;
    SELECT COUNT(*) INTO config_count FROM category_attributes;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Installation terminée avec succès !';
    RAISE NOTICE '   - Attributs système créés: %', attr_count;
    RAISE NOTICE '   - Configurations catégories: %', config_count;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Système d''attributs opérationnel !';
END $$;