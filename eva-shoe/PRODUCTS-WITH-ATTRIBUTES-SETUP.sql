-- PRODUCTS-WITH-ATTRIBUTES-SETUP.sql
-- Amélioration de la table products pour intégration avec les attributs

-- =====================================================
-- VÉRIFIER ET AMÉLIORER LA TABLE PRODUCTS
-- =====================================================

-- Ajouter des colonnes si elles n'existent pas déjà
DO $$
BEGIN
    -- Ajouter stock_quantity si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
        ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
    END IF;
    
    -- Ajouter reserved_quantity si elle n'existe pas  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'reserved_quantity') THEN
        ALTER TABLE products ADD COLUMN reserved_quantity INTEGER DEFAULT 0;
    END IF;
    
    -- Ajouter security_stock si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'security_stock') THEN
        ALTER TABLE products ADD COLUMN security_stock INTEGER DEFAULT 5;
    END IF;
    
    -- Ajouter status si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'status') THEN
        ALTER TABLE products ADD COLUMN status VARCHAR(20) DEFAULT 'draft' 
        CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
    
    -- Ajouter tags JSONB si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'tags') THEN
        ALTER TABLE products ADD COLUMN tags JSONB DEFAULT '[]';
    END IF;
    
    -- Ajouter purchase_count si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'purchase_count') THEN
        ALTER TABLE products ADD COLUMN purchase_count INTEGER DEFAULT 0;
    END IF;
    
    -- Ajouter view_count si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'view_count') THEN
        ALTER TABLE products ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- =====================================================
-- CRÉER LA TABLE PRODUCT_IMAGES SI ELLE N'EXISTE PAS
-- =====================================================

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les images
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(is_primary);

-- =====================================================
-- AMÉLIORER LA TABLE PRODUCT_ATTRIBUTES (si elle existe déjà)
-- =====================================================

-- Ajouter une colonne pour identifier la source de la valeur
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_attributes') THEN
        -- Ajouter is_inherited si elle n'existe pas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'product_attributes' AND column_name = 'is_inherited') THEN
            ALTER TABLE product_attributes ADD COLUMN is_inherited BOOLEAN DEFAULT false;
        END IF;
        
        -- Ajouter display_value si elle n'existe pas (pour affichage formaté)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'product_attributes' AND column_name = 'display_value') THEN
            ALTER TABLE product_attributes ADD COLUMN display_value TEXT;
        END IF;
    END IF;
END $$;

-- =====================================================
-- CRÉER DES VUES UTILES POUR LES PRODUITS
-- =====================================================

-- Vue pour les produits avec leurs attributs
CREATE OR REPLACE VIEW products_with_attributes AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'attribute_id', pa.attribute_id,
                'attribute_name', at.name,
                'attribute_slug', at.slug,
                'attribute_type', at.type,
                'text_value', pa.text_value,
                'number_value', pa.number_value,
                'json_value', pa.json_value,
                'display_value', pa.display_value,
                'is_inherited', pa.is_inherited
            )
        ) FILTER (WHERE pa.id IS NOT NULL), 
        '[]'::json
    ) as attributes,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', pi.id,
                'image_url', pi.image_url,
                'alt_text', pi.alt_text,
                'is_primary', pi.is_primary,
                'display_order', pi.display_order
            )
            ORDER BY pi.display_order, pi.created_at
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'::json
    ) as images
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_attributes pa ON p.id = pa.product_id
LEFT JOIN attribute_types at ON pa.attribute_id = at.id
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, c.name, c.slug;

-- Vue pour les statistiques des produits
CREATE OR REPLACE VIEW products_stats AS
SELECT 
    COUNT(*) as total_products,
    COUNT(*) FILTER (WHERE status = 'published') as published_products,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_products,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_products,
    COUNT(*) FILTER (WHERE stock_quantity <= security_stock) as low_stock_products,
    COUNT(*) FILTER (WHERE stock_quantity = 0) as out_of_stock_products,
    AVG(price) as average_price,
    SUM(view_count) as total_views,
    SUM(purchase_count) as total_purchases
FROM products 
WHERE is_active = true;

-- =====================================================
-- FONCTIONS UTILES
-- =====================================================

-- Fonction pour générer un SKU automatique
CREATE OR REPLACE FUNCTION generate_sku(product_name TEXT, category_id UUID)
RETURNS TEXT AS $$
DECLARE
    category_code TEXT;
    name_code TEXT;
    counter INTEGER;
    new_sku TEXT;
BEGIN
    -- Récupérer le code de la catégorie (3 premières lettres)
    SELECT UPPER(LEFT(REPLACE(name, ' ', ''), 3)) 
    INTO category_code 
    FROM categories 
    WHERE id = category_id;
    
    -- Récupérer le code du produit (3 premières lettres)
    SELECT UPPER(LEFT(REPLACE(product_name, ' ', ''), 3)) 
    INTO name_code;
    
    -- Trouver le prochain numéro disponible
    SELECT COALESCE(MAX(CAST(RIGHT(sku, 3) AS INTEGER)), 0) + 1
    INTO counter
    FROM products 
    WHERE sku LIKE category_code || name_code || '%';
    
    -- Générer le SKU final
    new_sku := category_code || name_code || LPAD(counter::TEXT, 3, '0');
    
    RETURN new_sku;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le slug automatiquement
CREATE OR REPLACE FUNCTION update_product_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            )
        );
        
        -- S'assurer que le slug est unique
        WHILE EXISTS (SELECT 1 FROM products WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
            NEW.slug := NEW.slug || '-' || EXTRACT(epoch FROM NOW())::INTEGER;
        END LOOP;
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le slug et updated_at
DROP TRIGGER IF EXISTS trigger_update_product_slug ON products;
CREATE TRIGGER trigger_update_product_slug
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_slug();

-- =====================================================
-- ACTIVER RLS ET CRÉER LES POLITIQUES
-- =====================================================

-- RLS pour products (si pas déjà activé)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politiques pour products
DROP POLICY IF EXISTS "Lecture publique des produits publiés" ON products;
CREATE POLICY "Lecture publique des produits publiés" ON products 
    FOR SELECT USING (status = 'published' AND is_active = true);

DROP POLICY IF EXISTS "Admin tous droits produits" ON products;
CREATE POLICY "Admin tous droits produits" ON products 
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS pour product_images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des images" ON product_images;
CREATE POLICY "Lecture publique des images" ON product_images 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin tous droits images" ON product_images;
CREATE POLICY "Admin tous droits images" ON product_images 
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- VÉRIFICATIONS FINALES
-- =====================================================

-- Compter les produits existants
SELECT 
    'Produits existants:' as info,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'published' OR is_published = true) as publiés,
    COUNT(*) FILTER (WHERE status = 'draft' OR is_published = false) as brouillons
FROM products;

-- Vérifier les colonnes de la table products
SELECT 
    'Structure de la table products:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;