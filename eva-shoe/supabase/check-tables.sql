-- =====================================================
-- VÉRIFICATION DES TABLES EXISTANTES - EVA SHOE
-- =====================================================

-- 1. VÉRIFIER LES TABLES EXISTANTES
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'addresses', 'categories', 'products', 'variants', 'product_images')
ORDER BY table_name;

-- 2. VÉRIFIER LES COLONNES DE LA TABLE PROFILES (si elle existe)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. VÉRIFIER LES POLICIES EXISTANTES
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'addresses')
ORDER BY tablename, policyname;