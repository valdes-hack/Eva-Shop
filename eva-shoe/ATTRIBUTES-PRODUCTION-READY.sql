-- ATTRIBUTES-PRODUCTION-READY.sql
-- Version finale stable et testée pour la production

-- =====================================================
-- NETTOYAGE ET RECRÉATION COMPLÈTE
-- =====================================================

-- Supprimer toutes les anciennes tables d'attributs
DROP TABLE IF EXISTS product_attributes CASCADE;
DROP TABLE IF EXISTS category_attributes CASCADE; 
DROP TABLE IF EXISTS attribute_types CASCADE;

-- Créer la table products si elle n'existe pas
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
-- CRÉATION DES TABLES D'ATTRIBUTS
-- =====================================================

-- Table des types d'attributs (définitions)
CREATE TABLE attribute_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'number', 'select', 'color', 'boolean')),
    options JSONB DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table de liaison catégorie <-> attributs
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

-- Table des valeurs d'attributs pour les produits
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

-- =====================================================
-- INDEX POUR PERFORMANCES
-- =====================================================

CREATE INDEX idx_attribute_types_slug ON attribute_types(slug);
CREATE INDEX idx_attribute_types_active ON attribute_types(is_active);
CREATE INDEX idx_attribute_types_type ON attribute_types(type);

CREATE INDEX idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX idx_category_attributes_attribute ON category_attributes(attribute_id);
CREATE INDEX idx_category_attributes_filterable ON category_attributes(is_filterable);

CREATE INDEX idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX idx_product_attributes_attribute ON product_attributes(attribute_id);

-- =====================================================
-- DONNÉES INITIALES - LES 5 ATTRIBUTS ESSENTIELS
-- =====================================================

INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES
-- 1. Couleur (obligatoire pour TOUS)
('Couleur', 'couleur', 'select', 
 '{"values": ["Rouge", "Bleu", "Vert", "Noir", "Blanc", "Gris", "Marron", "Rose", "Violet", "Orange", "Jaune", "Beige", "Marine", "Bordeaux"]}',
 '{"required": true}', 'Couleur principale du produit', true),

-- 2. Taille (obligatoire pour vêtements)  
('Taille', 'taille', 'select',
 '{"values": ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "34", "36", "38", "40", "42", "44", "46", "48"]}',
 '{"required": true}', 'Taille pour vêtements', true),

-- 3. Pointure (obligatoire pour chaussures)
('Pointure', 'pointure', 'select',
 '{"values": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"]}',
 '{"required": true}', 'Pointure pour chaussures', true),

-- 4. Marque (optionnel mais recommandé)
('Marque', 'marque', 'select',
 '{"values": ["Nike", "Adidas", "Puma", "Reebok", "Converse", "Vans", "New Balance", "Jordan", "Zara", "H&M", "Bershka", "Pull & Bear", "Local", "Autre"], "allow_custom": true}',
 '{"required": false}', 'Marque du produit', true),

-- 5. Matière (optionnel)
('Matière', 'matiere', 'select',
 '{"values": ["Coton", "Polyester", "Cuir", "Daim", "Toile", "Denim", "Laine", "Soie", "Lin", "Synthétique", "Mixte"], "allow_custom": true}',
 '{"required": false}', 'Matière principale du produit', true);

-- =====================================================
-- CONFIGURATION RLS (Row Level Security)
-- =====================================================

-- Activer RLS
ALTER TABLE attribute_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (pour le site)
CREATE POLICY "public_read_attribute_types" ON attribute_types 
    FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_category_attributes" ON category_attributes 
    FOR SELECT USING (true);

CREATE POLICY "public_read_product_attributes" ON product_attributes 
    FOR SELECT USING (true);

-- Politiques d'administration (pour le dashboard)
CREATE POLICY "admin_all_attribute_types" ON attribute_types 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_category_attributes" ON category_attributes 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_product_attributes" ON product_attributes 
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- CONFIGURATION AUTOMATIQUE DES CATÉGORIES EXISTANTES
-- =====================================================

-- Fonction pour configurer automatiquement les attributs par catégorie
DO $$
DECLARE
    couleur_id UUID;
    taille_id UUID;
    pointure_id UUID;
    marque_id UUID;
    matiere_id UUID;
    cat_record RECORD;
BEGIN
    -- Récupérer les IDs des attributs créés
    SELECT id INTO couleur_id FROM attribute_types WHERE slug = 'couleur';
    SELECT id INTO taille_id FROM attribute_types WHERE slug = 'taille';
    SELECT id INTO pointure_id FROM attribute_types WHERE slug = 'pointure';
    SELECT id INTO marque_id FROM attribute_types WHERE slug = 'marque';
    SELECT id INTO matiere_id FROM attribute_types WHERE slug = 'matiere';

    -- Pour chaque catégorie active
    FOR cat_record IN SELECT id, name, slug FROM categories WHERE is_active = true LOOP
        
        -- COULEUR : Obligatoire pour TOUTES les catégories
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        VALUES (cat_record.id, couleur_id, true, true, 1)
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        
        -- MARQUE : Optionnel pour toutes
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        VALUES (cat_record.id, marque_id, false, true, 2)
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        
        -- MATIÈRE : Optionnel pour toutes
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        VALUES (cat_record.id, matiere_id, false, true, 3)
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        
        -- TAILLE : Obligatoire pour les vêtements
        IF (cat_record.slug ILIKE '%vetement%' OR 
            cat_record.name ILIKE '%vetement%' OR 
            cat_record.name ILIKE '%shirt%' OR 
            cat_record.name ILIKE '%robe%' OR
            cat_record.name ILIKE '%pantalon%' OR
            cat_record.name ILIKE '%jean%' OR
            cat_record.name ILIKE '%pull%' OR
            cat_record.name ILIKE '%chemise%') THEN
            
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (cat_record.id, taille_id, true, true, 4)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
        -- POINTURE : Obligatoire pour les chaussures
        IF (cat_record.slug ILIKE '%chaussure%' OR 
            cat_record.name ILIKE '%chaussure%' OR 
            cat_record.name ILIKE '%basket%' OR 
            cat_record.name ILIKE '%sandal%' OR
            cat_record.name ILIKE '%boot%' OR
            cat_record.name ILIKE '%sneaker%') THEN
            
            INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
            VALUES (cat_record.id, pointure_id, true, true, 4)
            ON CONFLICT (category_id, attribute_id) DO NOTHING;
        END IF;
        
    END LOOP;
END $$;

-- =====================================================
-- VÉRIFICATIONS FINALES
-- =====================================================

-- Statistiques de création
SELECT 
    'Attributs créés' as type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_system = true) as systeme,
    COUNT(*) FILTER (WHERE is_active = true) as actifs
FROM attribute_types;

SELECT 
    'Configurations créées' as type,
    COUNT(*) as total,
    COUNT(DISTINCT category_id) as categories_configurees,
    COUNT(*) FILTER (WHERE is_required = true) as attributs_obligatoires
FROM category_attributes;

-- Liste des catégories configurées avec leurs attributs
SELECT 
    c.name as categorie,
    COUNT(ca.*) as nb_attributs,
    COUNT(*) FILTER (WHERE ca.is_required = true) as obligatoires,
    COUNT(*) FILTER (WHERE ca.is_filterable = true) as filtrables
FROM categories c
LEFT JOIN category_attributes ca ON c.id = ca.category_id
WHERE c.is_active = true
GROUP BY c.id, c.name
ORDER BY c.name;