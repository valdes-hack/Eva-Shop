-- ATTRIBUTES-FINAL-FIX.sql
-- Version finale sans RAISE NOTICE pour éviter les erreurs

-- Créer la table products si elle n'existe pas (pour les foreign keys)
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

-- Supprimer les anciennes tables d'attributs si elles existent
DROP TABLE IF EXISTS product_attributes CASCADE;
DROP TABLE IF EXISTS category_attributes CASCADE;
DROP TABLE IF EXISTS attribute_types CASCADE;

-- Créer la table attribute_types
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

-- Créer la table category_attributes  
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

-- Créer la table product_attributes
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

-- Créer les index
CREATE INDEX idx_attribute_types_slug ON attribute_types(slug);
CREATE INDEX idx_attribute_types_active ON attribute_types(is_active);
CREATE INDEX idx_category_attributes_category ON category_attributes(category_id);
CREATE INDEX idx_category_attributes_attribute ON category_attributes(attribute_id);
CREATE INDEX idx_product_attributes_product ON product_attributes(product_id);

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

-- Activer RLS sur toutes les tables
ALTER TABLE attribute_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_attributes ENABLE ROW LEVEL SECURITY; 
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de lecture publique
CREATE POLICY "Lecture publique attribute_types" ON attribute_types 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Lecture publique category_attributes" ON category_attributes 
    FOR SELECT USING (true);

CREATE POLICY "Lecture publique product_attributes" ON product_attributes 
    FOR SELECT USING (true);

-- Créer les politiques d'administration  
CREATE POLICY "Admin attribute_types" ON attribute_types 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin category_attributes" ON category_attributes 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin product_attributes" ON product_attributes 
    FOR ALL USING (auth.role() = 'authenticated');

-- Configuration automatique pour les catégories principales
-- Ajouter couleur à toutes les catégories actives
INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
SELECT 
    c.id,
    a.id,
    true,
    true,
    1
FROM categories c
CROSS JOIN attribute_types a
WHERE c.is_active = true 
  AND a.slug = 'couleur'
ON CONFLICT (category_id, attribute_id) DO NOTHING;

-- Ajouter taille aux catégories de vêtements
INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
SELECT 
    c.id,
    a.id,
    true,
    true,
    2
FROM categories c
CROSS JOIN attribute_types a
WHERE c.is_active = true 
  AND (c.slug ILIKE '%vetement%' OR c.name ILIKE '%vetement%' OR c.name ILIKE '%shirt%' OR c.name ILIKE '%robe%')
  AND a.slug = 'taille'
ON CONFLICT (category_id, attribute_id) DO NOTHING;

-- Ajouter pointure aux catégories de chaussures
INSERT INTO category_attributes (category_id, attribute_id, is_required, is_filterable, display_order)
SELECT 
    c.id,
    a.id,
    true,
    true,
    2
FROM categories c
CROSS JOIN attribute_types a
WHERE c.is_active = true 
  AND (c.slug ILIKE '%chaussure%' OR c.name ILIKE '%chaussure%' OR c.name ILIKE '%basket%' OR c.name ILIKE '%sandal%')
  AND a.slug = 'pointure'
ON CONFLICT (category_id, attribute_id) DO NOTHING;

-- Vérification finale (simple SELECT)
SELECT 'Installation terminée - Vérification:' as status;
SELECT COUNT(*) as "Types d'attributs créés" FROM attribute_types;
SELECT COUNT(*) as "Configurations créées" FROM category_attributes;
SELECT COUNT(DISTINCT category_id) as "Catégories configurées" FROM category_attributes;