-- SUPABASE-RLS-ATTRIBUTES.sql
-- Configuration des politiques RLS pour les tables d'attributs

-- =====================================================
-- ACTIVER RLS SUR LES TABLES D'ATTRIBUTS
-- =====================================================

-- Activer RLS sur attribute_types
ALTER TABLE attribute_types ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur category_attributes  
ALTER TABLE category_attributes ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur product_attributes
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUES POUR attribute_types
-- =====================================================

-- Lecture publique des types d'attributs actifs (pour affichage)
CREATE POLICY "Lecture publique des types d'attributs" ON attribute_types
    FOR SELECT
    USING (is_active = true);

-- Gestion complète pour les utilisateurs authentifiés (admin)
CREATE POLICY "Gestion complète des attributs pour admin" ON attribute_types
    FOR ALL
    USING (auth.role() = 'authenticated');

-- =====================================================
-- POLITIQUES POUR category_attributes
-- =====================================================

-- Lecture publique des attributs de catégorie (pour affichage et filtres)
CREATE POLICY "Lecture publique des attributs de catégorie" ON category_attributes
    FOR SELECT
    USING (true);

-- Gestion complète pour les utilisateurs authentifiés (admin)
CREATE POLICY "Gestion complète des attributs de catégorie pour admin" ON category_attributes
    FOR ALL
    USING (auth.role() = 'authenticated');

-- =====================================================
-- POLITIQUES POUR product_attributes
-- =====================================================

-- Lecture publique des attributs de produit (pour affichage)
CREATE POLICY "Lecture publique des attributs de produit" ON product_attributes
    FOR SELECT
    USING (true);

-- Gestion complète pour les utilisateurs authentifiés (admin)
CREATE POLICY "Gestion complète des attributs de produit pour admin" ON product_attributes
    FOR ALL
    USING (auth.role() = 'authenticated');

-- =====================================================
-- FONCTION D'AIDE POUR VÉRIFIER LES TABLES EXPOSÉES
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Politiques RLS configurées pour les attributs !';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Tables maintenant exposées via l''API Supabase:';
    RAISE NOTICE '  - attribute_types (lecture publique + gestion admin)';
    RAISE NOTICE '  - category_attributes (lecture publique + gestion admin)';
    RAISE NOTICE '  - product_attributes (lecture publique + gestion admin)';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 L''interface web devrait maintenant fonctionner !';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Pour tester:';
    RAISE NOTICE '  1. Rafraîchir la page web';
    RAISE NOTICE '  2. Aller dans l''onglet Attributs d''une catégorie';  
    RAISE NOTICE '  3. Visiter /categories/attributs';
    RAISE NOTICE '';
END $$;

-- =====================================================
-- VÉRIFICATION DES DONNÉES
-- =====================================================

-- Vérifier que les données sont bien présentes
DO $$
DECLARE
    attr_count INTEGER;
    config_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO attr_count FROM attribute_types;
    SELECT COUNT(*) INTO config_count FROM category_attributes;
    
    IF attr_count > 0 THEN
        RAISE NOTICE '✅ % types d''attributs trouvés en base', attr_count;
    ELSE
        RAISE NOTICE '⚠️ Aucun type d''attribut trouvé - réexécuter ATTRIBUTES-CLEAN-INSTALL.sql';
    END IF;
    
    IF config_count > 0 THEN
        RAISE NOTICE '✅ % configurations d''attributs trouvées', config_count;
    ELSE
        RAISE NOTICE 'ℹ️ Aucune configuration d''attribut (normal si pas de catégories compatibles)';
    END IF;
END $$;