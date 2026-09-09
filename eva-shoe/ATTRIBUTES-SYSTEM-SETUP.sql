-- ATTRIBUTES-SYSTEM-SETUP.sql
-- Système de gestion des attributs par catégorie pour EVA SHOE

-- =====================================================
-- TABLE: TYPES D'ATTRIBUTS
-- =====================================================
-- Définit les types d'attributs disponibles (couleur, taille, pointure, etc.)
CREATE TABLE IF NOT EXISTS attribute_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'text', 'number', 'select', 'multiselect', 'color', 'size'
    
    -- Configuration du type d'attribut
    options JSONB, -- Pour select/multiselect: {"values": ["Rouge", "Bleu", "Vert"]}
    validation_rules JSONB, -- Règles de validation: {"min": 35, "max": 45, "required": true}
    display_config JSONB, -- Configuration d'affichage: {"format": "badge", "color_preview": true}
    
    -- Métadonnées
    description TEXT,
    is_system BOOLEAN DEFAULT false, -- true = créé par le système, false = créé par l'admin
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLE: ATTRIBUTION AUX CATÉGORIES  
-- =====================================================
-- Lie les types d'attributs aux catégories avec configuration spécifique
CREATE TABLE IF NOT EXISTS category_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attribute_types(id) ON DELETE CASCADE,
    
    -- Configuration par catégorie
    is_required BOOLEAN DEFAULT false, -- Obligatoire lors de l'ajout produit
    is_inherited BOOLEAN DEFAULT false, -- Hérité de la catégorie parente
    is_filterable BOOLEAN DEFAULT true, -- Utilisable dans les filtres
    is_visible_in_list BOOLEAN DEFAULT true, -- Affiché dans les listes produits
    
    -- Affichage et ordre
    display_order INTEGER DEFAULT 0,
    display_name VARCHAR(100), -- Nom personnalisé pour cette catégorie (optionnel)
    
    -- Configuration spécifique
    category_config JSONB, -- Config spécifique: {"default_value": "Unique", "show_in_title": true}
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Contraintes
    UNIQUE(category_id, attribute_id)
);

-- =====================================================
-- TABLE: VALEURS D'ATTRIBUTS POUR LES PRODUITS
-- =====================================================  
-- Stocke les valeurs réelles des attributs pour chaque produit
CREATE TABLE IF NOT EXISTS product_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attribute_types(id) ON DELETE CASCADE,
    
    -- Valeur de l'attribut (selon le type)
    text_value TEXT,           -- Pour type 'text'
    number_value DECIMAL(10,2), -- Pour type 'number'
    json_value JSONB,          -- Pour types 'select', 'multiselect', 'color'
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Contraintes
    UNIQUE(product_id, attribute_id)
);

-- =====================================================
-- INDEX POUR PERFORMANCES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_attribute_types_slug ON attribute_types(slug);
CREATE INDEX IF NOT EXISTS idx_attribute_types_type ON attribute_types(type);
CREATE INDEX IF NOT EXISTS idx_attribute_types_active ON attribute_types(is_active);

CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_attribute ON category_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_required ON category_attributes(is_required);
CREATE INDEX IF NOT EXISTS idx_category_attributes_filterable ON category_attributes(is_filterable);

CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_attribute ON product_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_text_value ON product_attributes(text_value);
CREATE INDEX IF NOT EXISTS idx_product_attributes_number_value ON product_attributes(number_value);
CREATE INDEX IF NOT EXISTS idx_product_attributes_json_value ON product_attributes USING GIN(json_value);

-- =====================================================
-- ATTRIBUTS PRÉDÉFINIS SELON LE CdCF
-- =====================================================
-- Types d'attributs de base pour l'e-commerce mode
INSERT INTO attribute_types (name, slug, type, options, validation_rules, description, is_system) VALUES

-- Attributs universels
('Couleur', 'couleur', 'color', 
 '{"values": ["Rouge", "Bleu", "Vert", "Noir", "Blanc", "Gris", "Marron", "Rose", "Violet", "Orange", "Jaune"], "allow_custom": true}',
 '{"required": true}',
 'Couleur principale du produit', true),

('Marque', 'marque', 'select',
 '{"values": ["Nike", "Adidas", "Puma", "Reebok", "Converse", "Vans", "New Balance", "Jordan", "Zara", "H&M", "Local"], "allow_custom": true}',
 '{"required": false}',
 'Marque du produit', true),

('Matière', 'matiere', 'select',
 '{"values": ["Coton", "Polyester", "Cuir", "Daim", "Toile", "Denim", "Laine", "Soie", "Lin", "Synthétique"], "allow_custom": true}',
 '{"required": false}',
 'Matière principale du produit', true),

-- Attributs pour vêtements
('Taille Vêtement', 'taille-vetement', 'select',
 '{"values": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], "size_chart": "clothing"}',
 '{"required": true}',
 'Taille pour vêtements (XS à XXXL)', true),

('Coupe', 'coupe', 'select',
 '{"values": ["Slim", "Regular", "Loose", "Oversize", "Skinny", "Bootcut", "Straight"], "allow_custom": false}',
 '{"required": false}',
 'Type de coupe du vêtement', true),

('Style', 'style', 'select',
 '{"values": ["Casual", "Formel", "Sport", "Chic", "Vintage", "Moderne", "Classique"], "allow_custom": true}',
 '{"required": false}',
 'Style du vêtement', true),

('Longueur', 'longueur', 'select',
 '{"values": ["Court", "Mi-long", "Long", "Maxi"], "allow_custom": false}',
 '{"required": false}',
 'Longueur du vêtement (robes, jupes)', true),

-- Attributs pour chaussures  
('Pointure', 'pointure', 'select',
 '{"values": ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"], "numeric": true}',
 '{"required": true, "min": 35, "max": 45}',
 'Pointure des chaussures (35-45)', true),

('Type Chaussure', 'type-chaussure', 'select',
 '{"values": ["Baskets", "Sandales", "Escarpins", "Bottes", "Mocassins", "Derbies", "Ballerines"], "allow_custom": false}',
 '{"required": false}',
 'Type de chaussure', true),

('Hauteur Talon', 'hauteur-talon', 'select',
 '{"values": ["Plat (0-1cm)", "Bas (2-3cm)", "Moyen (4-6cm)", "Haut (7-10cm)", "Très haut (+10cm)"], "allow_custom": false}',
 '{"required": false}',
 'Hauteur du talon pour chaussures femme', true),

-- Attributs pour accessoires
('Type Accessoire', 'type-accessoire', 'select',
 '{"values": ["Sac à main", "Sac à dos", "Portefeuille", "Ceinture", "Montre", "Collier", "Bracelet", "Boucles d''oreilles"], "allow_custom": true}',
 '{"required": false}',
 'Type d\'accessoire', true),

-- Attributs techniques
('Collection', 'collection', 'text',
 '{}',
 '{"max_length": 100}',
 'Nom de la collection', true),

('Entretien', 'entretien', 'multiselect',
 '{"values": ["Lavage à 30°", "Lavage à froid", "Séchage à l\'air", "Repassage faible", "Nettoyage à sec", "Ne pas blanchir"], "allow_custom": false}',
 '{"required": false}',
 'Instructions d\'entretien', true)

ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- CONFIGURATION PAR DÉFAUT SELON LE CdCF
-- =====================================================
-- Attribution automatique selon les catégories principales

-- Pour VÊTEMENTS (général)
DO $$
DECLARE
    vetements_id UUID;
    attr_id UUID;
BEGIN
    -- Récupérer l'ID de la catégorie Vêtements
    SELECT id INTO vetements_id FROM categories WHERE slug = 'vetements' LIMIT 1;
    
    IF vetements_id IS NOT NULL THEN
        -- Attributs obligatoires pour vêtements
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order) 
        SELECT vetements_id, id, true, true, 
               CASE slug 
                   WHEN 'taille-vetement' THEN 1
                   WHEN 'couleur' THEN 2
                   ELSE 10
               END
        FROM attribute_types 
        WHERE slug IN ('taille-vetement', 'couleur')
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        
        -- Attributs optionnels pour vêtements
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        SELECT vetements_id, id, false, true,
               CASE slug
                   WHEN 'marque' THEN 3
                   WHEN 'matiere' THEN 4
                   WHEN 'coupe' THEN 5
                   WHEN 'style' THEN 6
                   WHEN 'collection' THEN 7
                   WHEN 'entretien' THEN 8
                   ELSE 20
               END
        FROM attribute_types 
        WHERE slug IN ('marque', 'matiere', 'coupe', 'style', 'collection', 'entretien')
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
    END IF;
END $$;

-- Pour CHAUSSURES (général)
DO $$
DECLARE
    chaussures_id UUID;
BEGIN
    SELECT id INTO chaussures_id FROM categories WHERE slug = 'chaussures' LIMIT 1;
    
    IF chaussures_id IS NOT NULL THEN
        -- Attributs obligatoires pour chaussures
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        SELECT chaussures_id, id, true, true,
               CASE slug
                   WHEN 'pointure' THEN 1
                   WHEN 'couleur' THEN 2
                   ELSE 10
               END
        FROM attribute_types 
        WHERE slug IN ('pointure', 'couleur')
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
        
        -- Attributs optionnels pour chaussures
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        SELECT chaussures_id, id, false, true,
               CASE slug
                   WHEN 'marque' THEN 3
                   WHEN 'matiere' THEN 4
                   WHEN 'type-chaussure' THEN 5
                   ELSE 20
               END
        FROM attribute_types 
        WHERE slug IN ('marque', 'matiere', 'type-chaussure')
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
    END IF;
END $$;

-- Pour ACCESSOIRES (général)
DO $$
DECLARE
    accessoires_id UUID;
BEGIN
    SELECT id INTO accessoires_id FROM categories WHERE slug = 'accessoires' LIMIT 1;
    
    IF accessoires_id IS NOT NULL THEN
        -- Attributs pour accessoires
        INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
        SELECT accessoires_id, id, 
               CASE WHEN slug = 'couleur' THEN true ELSE false END,
               true,
               CASE slug
                   WHEN 'couleur' THEN 1
                   WHEN 'type-accessoire' THEN 2
                   WHEN 'marque' THEN 3
                   WHEN 'matiere' THEN 4
                   ELSE 20
               END
        FROM attribute_types 
        WHERE slug IN ('couleur', 'type-accessoire', 'marque', 'matiere')
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour propager automatiquement les attributs aux sous-catégories
CREATE OR REPLACE FUNCTION inherit_category_attributes()
RETURNS TRIGGER AS $$
BEGIN
    -- Si une nouvelle liaison catégorie-attribut est créée
    IF TG_OP = 'INSERT' THEN
        -- Propager aux sous-catégories (enfants directs uniquement pour éviter la complexité)
        INSERT INTO category_attributes (
            category_id, 
            attribute_id, 
            is_required, 
            is_inherited, 
            is_filterable,
            display_order
        )
        SELECT 
            c.id,
            NEW.attribute_id,
            NEW.is_required,
            true, -- Marquer comme hérité
            NEW.is_filterable,
            NEW.display_order
        FROM categories c
        WHERE c.parent_id = NEW.category_id
        ON CONFLICT (category_id, attribute_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour l'héritage automatique
DROP TRIGGER IF EXISTS trigger_inherit_category_attributes ON category_attributes;
CREATE TRIGGER trigger_inherit_category_attributes
    AFTER INSERT ON category_attributes
    FOR EACH ROW
    EXECUTE FUNCTION inherit_category_attributes();

-- =====================================================
-- VÉRIFICATIONS ET STATISTIQUES
-- =====================================================
DO $$
DECLARE
    attr_count INTEGER;
    config_count INTEGER;
    vetements_attrs INTEGER;
    chaussures_attrs INTEGER;
    accessoires_attrs INTEGER;
BEGIN
    SELECT COUNT(*) INTO attr_count FROM attribute_types;
    SELECT COUNT(*) INTO config_count FROM category_attributes;
    
    SELECT COUNT(*) INTO vetements_attrs 
    FROM category_attributes ca
    JOIN categories c ON ca.category_id = c.id 
    WHERE c.slug = 'vetements';
    
    SELECT COUNT(*) INTO chaussures_attrs
    FROM category_attributes ca  
    JOIN categories c ON ca.category_id = c.id
    WHERE c.slug = 'chaussures';
    
    SELECT COUNT(*) INTO accessoires_attrs
    FROM category_attributes ca
    JOIN categories c ON ca.category_id = c.id  
    WHERE c.slug = 'accessoires';
    
    RAISE NOTICE '✅ Système d''attributs installé avec succès:';
    RAISE NOTICE '   - Types d''attributs créés: %', attr_count;
    RAISE NOTICE '   - Configurations catégories: %', config_count;
    RAISE NOTICE '   - Attributs Vêtements: %', vetements_attrs;
    RAISE NOTICE '   - Attributs Chaussures: %', chaussures_attrs;  
    RAISE NOTICE '   - Attributs Accessoires: %', accessoires_attrs;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Prêt pour la gestion des attributs produits !';
END $$;

COMMIT;