-- DEBUG-CHECK-TABLES.sql
-- Script de diagnostic pour vérifier l'état des tables

-- =====================================================
-- VÉRIFIER QUELLES TABLES EXISTENT
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔍 DIAGNOSTIC DES TABLES EXISTANTES';
    RAISE NOTICE '=====================================';
    RAISE NOTICE '';
END $$;

-- Lister toutes les tables qui contiennent "attribute" dans le nom
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%attribute%' OR table_name LIKE '%categor%')
ORDER BY table_name;

-- Vérifier si les tables d'attributs existent spécifiquement
DO $$
DECLARE
    has_attribute_types BOOLEAN := FALSE;
    has_category_attributes BOOLEAN := FALSE;
    has_product_attributes BOOLEAN := FALSE;
    has_categories BOOLEAN := FALSE;
    has_products BOOLEAN := FALSE;
BEGIN
    -- Vérifier attribute_types
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'attribute_types'
    ) INTO has_attribute_types;
    
    -- Vérifier category_attributes
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'category_attributes'
    ) INTO has_category_attributes;
    
    -- Vérifier product_attributes
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'product_attributes'
    ) INTO has_product_attributes;
    
    -- Vérifier categories (devrait exister)
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'categories'
    ) INTO has_categories;
    
    -- Vérifier products (peut ne pas exister)
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'products'
    ) INTO has_products;
    
    -- Afficher les résultats
    RAISE NOTICE '📋 État des tables:';
    RAISE NOTICE '  - categories: %', CASE WHEN has_categories THEN '✅ EXISTE' ELSE '❌ MANQUE' END;
    RAISE NOTICE '  - products: %', CASE WHEN has_products THEN '✅ EXISTE' ELSE '⚠️ MANQUE (normal)' END;
    RAISE NOTICE '  - attribute_types: %', CASE WHEN has_attribute_types THEN '✅ EXISTE' ELSE '❌ MANQUE' END;
    RAISE NOTICE '  - category_attributes: %', CASE WHEN has_category_attributes THEN '✅ EXISTE' ELSE '❌ MANQUE' END;
    RAISE NOTICE '  - product_attributes: %', CASE WHEN has_product_attributes THEN '✅ EXISTE' ELSE '❌ MANQUE' END;
    RAISE NOTICE '';
    
    -- Diagnostic et recommandations
    IF NOT has_categories THEN
        RAISE NOTICE '🚨 PROBLÈME MAJEUR: Table categories manquante !';
        RAISE NOTICE '   Solution: Réexécuter le script de création des catégories';
    END IF;
    
    IF NOT has_attribute_types THEN
        RAISE NOTICE '❌ Tables d''attributs manquantes';
        RAISE NOTICE '   Solution: Réexécuter ATTRIBUTES-SIMPLE-CREATE.sql (voir ci-dessous)';
    ELSE
        RAISE NOTICE '✅ Tables d''attributs présentes';
        RAISE NOTICE '   Solution: Exécuter SUPABASE-RLS-ATTRIBUTES.sql pour les permissions';
    END IF;
    
    RAISE NOTICE '';
END $$;

-- =====================================================
-- VÉRIFIER LES CONTRAINTES FOREIGN KEY
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '🔗 Vérification des contraintes:';
    
    -- Vérifier si la table products existe pour les foreign keys
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        RAISE NOTICE '  - Table products: ✅ EXISTE (FK possible)';
    ELSE
        RAISE NOTICE '  - Table products: ⚠️ MANQUE (FK impossible - normal si pas encore créée)';
    END IF;
END $$;