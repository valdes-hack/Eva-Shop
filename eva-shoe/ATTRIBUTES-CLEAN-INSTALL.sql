-- ATTRIBUTES-CLEAN-INSTALL.sql
-- Nettoyage complet et réinstallation du système d'attributs

-- =====================================================
-- ÉTAPE 1: NETTOYAGE COMPLET (optionnel si problèmes)
-- =====================================================
-- Décommente les lignes suivantes SEULEMENT si tu veux tout nettoyer

-- DROP TABLE IF EXISTS product_attributes CASCADE;
-- DROP TABLE IF EXISTS category_attributes CASCADE;
-- DROP TABLE IF EXISTS attribute_types CASCADE;
-- DROP TABLE IF EXISTS attributes CASCADE; -- Au cas où l'ancienne table existe

-- =====================================================
-- ÉTAPE 2: CRÉATION DES TABLES PROPRES
-- =====================================================

-- Table des types d'attributs
CREATE TABLE IF NOT EXISTS attribute_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'number', 'select', 'multiselect', 'color', 'size')),
    options JSONB DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index sur attribute_types
CREATE INDEX IF NOT EXISTS idx_attribute_types_slug ON attribute_types(slug);
CREATE INDEX IF NOT EXISTS idx_attribute_types_type ON attribute_types(type);
CREATE INDEX IF NOT EXISTS idx_attribute_types_active ON attribute_types(is_active);

-- Table d'attribution aux catégories
CREATE TABLE IF NOT EXISTS category_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL,
    attribute_id UUID NOT NULL,
    is_required BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    display_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Contraintes
    UNIQUE(category_id, attribute_id),
    
    -- Foreign keys (ajoutées séparément pour éviter les erreurs)
    CONSTRAINT fk_category_attributes_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    CONSTRAINT fk_category_attributes_attribute 
        FOREIGN KEY (attribute_id) REFERENCES attribute_types(id) ON DELETE CASCADE
);

-- Index sur category_attributes
CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_attribute ON category_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_required ON category_attributes(is_required);

-- Table des valeurs pour produits (préparation future)
CREATE TABLE IF NOT EXISTS product_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    attribute_id UUID NOT NULL,
    text_value TEXT,
    number_value DECIMAL(10,2),
    json_value JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Contraintes
    UNIQUE(product_id, attribute_id),
    
    -- Foreign keys
    CONSTRAINT fk_product_attributes_product 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_attributes_attribute 
        FOREIGN KEY (attribute_id) REFERENCES attribute_types(id) ON DELETE CASCADE
);

-- Index sur product_attributes
CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_attribute ON product_attributes(attribute_id);

-- =====================================================
-- ÉTAPE 3: INSERTION DES ATTRIBUTS DE BASE
-- =====================================================

-- Nettoyer d'abord (au cas où)
DELETE FROM attribute_types WHERE is_system = true;

-- 1. Couleur (universel)
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system, is_active)
VALUES (
    'Couleur',
    'couleur', 
    'select',
    '{"values": ["Rouge", "Bleu", "Vert", "Noir", "Blanc", "Gris", "Marron", "Rose", "Violet", "Orange", "Jaune"], "allow_custom": true}',
    '{"required": true}',
    'Couleur principale du produit',
    true,
    true
);

-- 2. Marque (universel)
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system, is_active)
VALUES (
    'Marque',
    'marque',
    'select', 
    '{"values": ["Nike", "Adidas", "Puma", "Reebok", "Converse", "Vans", "New Balance", "Jordan", "Zara", "H&M", "Local"], "allow_custom": true}',
    '{"required": false}',
    'Marque du produit',
    true,
    true
);

-- 3. Matière (universel)
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system, is_active)
VALUES (
    'Matiere',
    'matiere',
    'select',
    '{"values": ["Coton", "Polyester", "Cuir", "Daim", "Toile", "Denim", "Laine", "Soie", "Lin", "Synthetique"], "allow_custom": true}',
    '{"required": false}',
    'Matière principale du produit',
    true,
    true
);

-- 4. Taille vêtement
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system, is_active)
VALUES (
    'Taille',
    'taille',
    'select',
    '{"values": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], "size_chart": "clothing"}',
    '{"required": true}',
    'Taille pour vêtements',
    true,
    true
);

-- 5. Pointure
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system, is_active)
VALUES (
    'Pointure',
    'pointure',
    'select',
    '{"values": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"], "numeric": true}',
    '{"required": true, "min": 35, "max": 45}',
    'Pointure des chaussures',
    true,
    true
);

-- =====================================================
-- ÉTAPE 4: CONFIGURATION DES CATÉGORIES
-- =====================================================

-- Nettoyer les anciennes configurations
DELETE FROM category_attributes;

-- Configuration pour Vêtements
DO $$
DECLARE
    vetements_id UUID;
    couleur_id UUID;
    taille_id UUID;
    marque_id UUID;
    matiere_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO vetements_id FROM categories WHERE slug = 'vetements' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    SELECT id INTO taille_id FROM attribute_types WHERE slug = 'taille' LIMIT 1;
    SELECT id INTO marque_id FROM attribute_types WHERE slug = 'marque' LIMIT 1;
    SELECT id INTO matiere_id FROM attribute_types WHERE slug = 'matiere' LIMIT 1;
    
    -- Vérifier que la catégorie et les attributs existent
    IF vetements_id IS NOT NULL THEN
        RAISE NOTICE 'Configuration de la catégorie Vêtements (ID: %)', vetements_id;
        
        -- Taille (obligatoire)
        IF taille_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (vetements_id, taille_id, true, true, 1, 'Taille');
            RAISE NOTICE '  ✓ Taille ajoutée (obligatoire)';
        END IF;
        
        -- Couleur (obligatoire)
        IF couleur_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (vetements_id, couleur_id, true, true, 2, 'Couleur');
            RAISE NOTICE '  ✓ Couleur ajoutée (obligatoire)';
        END IF;
        
        -- Marque (optionnel)
        IF marque_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (vetements_id, marque_id, false, true, 3, 'Marque');
            RAISE NOTICE '  ✓ Marque ajoutée (optionnel)';
        END IF;
        
        -- Matière (optionnel)
        IF matiere_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (vetements_id, matiere_id, false, true, 4, 'Matière');
            RAISE NOTICE '  ✓ Matière ajoutée (optionnel)';
        END IF;
        
    ELSE
        RAISE NOTICE 'Catégorie "vetements" non trouvée, configuration ignorée';
    END IF;
END $$;

-- Configuration pour Chaussures  
DO $$
DECLARE
    chaussures_id UUID;
    couleur_id UUID;
    pointure_id UUID;
    marque_id UUID;
    matiere_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO chaussures_id FROM categories WHERE slug = 'chaussures' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    SELECT id INTO pointure_id FROM attribute_types WHERE slug = 'pointure' LIMIT 1;
    SELECT id INTO marque_id FROM attribute_types WHERE slug = 'marque' LIMIT 1;
    SELECT id INTO matiere_id FROM attribute_types WHERE slug = 'matiere' LIMIT 1;
    
    -- Vérifier que la catégorie et les attributs existent
    IF chaussures_id IS NOT NULL THEN
        RAISE NOTICE 'Configuration de la catégorie Chaussures (ID: %)', chaussures_id;
        
        -- Pointure (obligatoire)
        IF pointure_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (chaussures_id, pointure_id, true, true, 1, 'Pointure');
            RAISE NOTICE '  ✓ Pointure ajoutée (obligatoire)';
        END IF;
        
        -- Couleur (obligatoire)
        IF couleur_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (chaussures_id, couleur_id, true, true, 2, 'Couleur');
            RAISE NOTICE '  ✓ Couleur ajoutée (obligatoire)';
        END IF;
        
        -- Marque (optionnel)
        IF marque_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (chaussures_id, marque_id, false, true, 3, 'Marque');
            RAISE NOTICE '  ✓ Marque ajoutée (optionnel)';
        END IF;
        
        -- Matière (optionnel)
        IF matiere_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (chaussures_id, matiere_id, false, true, 4, 'Matière');
            RAISE NOTICE '  ✓ Matière ajoutée (optionnel)';
        END IF;
        
    ELSE
        RAISE NOTICE 'Catégorie "chaussures" non trouvée, configuration ignorée';
    END IF;
END $$;

-- Configuration pour Accessoires
DO $$
DECLARE
    accessoires_id UUID;
    couleur_id UUID;
    marque_id UUID;
    matiere_id UUID;
BEGIN
    -- Récupérer les IDs
    SELECT id INTO accessoires_id FROM categories WHERE slug = 'accessoires' LIMIT 1;
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur' LIMIT 1;
    SELECT id INTO marque_id FROM attribute_types WHERE slug = 'marque' LIMIT 1;
    SELECT id INTO matiere_id FROM attribute_types WHERE slug = 'matiere' LIMIT 1;
    
    -- Vérifier que la catégorie et les attributs existent
    IF accessoires_id IS NOT NULL THEN
        RAISE NOTICE 'Configuration de la catégorie Accessoires (ID: %)', accessoires_id;
        
        -- Couleur (obligatoire)
        IF couleur_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (accessoires_id, couleur_id, true, true, 1, 'Couleur');
            RAISE NOTICE '  ✓ Couleur ajoutée (obligatoire)';
        END IF;
        
        -- Marque (optionnel)
        IF marque_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (accessoires_id, marque_id, false, true, 2, 'Marque');
            RAISE NOTICE '  ✓ Marque ajoutée (optionnel)';
        END IF;
        
        -- Matière (optionnel)
        IF matiere_id IS NOT NULL THEN
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order, display_name)
            VALUES (accessoires_id, matiere_id, false, true, 3, 'Matière');
            RAISE NOTICE '  ✓ Matière ajoutée (optionnel)';
        END IF;
        
    ELSE
        RAISE NOTICE 'Catégorie "accessoires" non trouvée, configuration ignorée';
    END IF;
END $$;

-- =====================================================
-- ÉTAPE 5: VÉRIFICATION ET RÉSUMÉ
-- =====================================================
DO $$
DECLARE
    attr_count INTEGER;
    config_count INTEGER;
    categories_count INTEGER;
BEGIN
    -- Compter les éléments
    SELECT COUNT(*) INTO attr_count FROM attribute_types WHERE is_system = true;
    SELECT COUNT(*) INTO config_count FROM category_attributes;
    SELECT COUNT(DISTINCT category_id) INTO categories_count FROM category_attributes;
    
    -- Affichage du résumé
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ INSTALLATION TERMINÉE AVEC SUCCÈS !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Résumé:';
    RAISE NOTICE '  - Types d''attributs créés: %', attr_count;
    RAISE NOTICE '  - Configurations d''attributs: %', config_count;
    RAISE NOTICE '  - Catégories configurées: %', categories_count;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Le système d''attributs est maintenant opérationnel !';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Prochaines étapes:';
    RAISE NOTICE '  1. Tester l''onglet Attributs dans une catégorie';
    RAISE NOTICE '  2. Visiter /categories/attributs pour la gestion';
    RAISE NOTICE '  3. Créer des produits avec ces attributs';
    RAISE NOTICE '';
    
    -- Détail des configurations si disponibles
    IF config_count > 0 THEN
        RAISE NOTICE '🔧 Détail des configurations:';
        FOR rec IN SELECT c.name as category_name, a.name as attribute_name, ca.is_required
                   FROM category_attributes ca
                   JOIN categories c ON ca.category_id = c.id
                   JOIN attribute_types a ON ca.attribute_id = a.id
                   ORDER BY c.name, ca.display_order
        LOOP
            RAISE NOTICE '  - % → % (%)', rec.category_name, rec.attribute_name, 
                         CASE WHEN rec.is_required THEN 'obligatoire' ELSE 'optionnel' END;
        END LOOP;
    END IF;
END $$;