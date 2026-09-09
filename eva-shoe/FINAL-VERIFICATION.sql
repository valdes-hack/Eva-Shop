-- FINAL-VERIFICATION.sql
-- Script de vérification finale après installation

SELECT '=== VÉRIFICATION FINALE DES ATTRIBUTS ===' as status;

-- 1. Vérifier l'existence des tables
SELECT 
    'Tables créées:' as verification,
    CASE WHEN COUNT(*) = 3 THEN '✅ TOUTES CRÉÉES' 
         ELSE '❌ MANQUANTES: ' || (3 - COUNT(*))::text END as resultat
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('attribute_types', 'category_attributes', 'product_attributes');

-- 2. Compter les attributs système
SELECT 
    'Attributs système:' as verification,
    COUNT(*)::text || ' types créés' as resultat
FROM attribute_types 
WHERE is_system = true AND is_active = true;

-- 3. Lister les attributs créés
SELECT 
    at.name as "Nom Attribut",
    at.type as "Type", 
    CASE WHEN at.is_system THEN 'Système' ELSE 'Personnalisé' END as "Source",
    COUNT(ca.*) as "Catégories configurées"
FROM attribute_types at
LEFT JOIN category_attributes ca ON at.id = ca.attribute_id
WHERE at.is_active = true
GROUP BY at.id, at.name, at.type, at.is_system
ORDER BY at.is_system DESC, at.name;

-- 4. Vérifier les configurations par catégorie
SELECT 
    c.name as "Catégorie",
    COUNT(ca.*) as "Nb Attributs",
    COUNT(*) FILTER (WHERE ca.is_required = true) as "Obligatoires",
    COUNT(*) FILTER (WHERE ca.is_filterable = true) as "Filtrables",
    CASE WHEN COUNT(ca.*) > 0 THEN '✅ Configurée' ELSE '⚠️ Vide' END as "Status"
FROM categories c
LEFT JOIN category_attributes ca ON c.id = ca.category_id
WHERE c.is_active = true
GROUP BY c.id, c.name
ORDER BY c.name;

-- 5. Test des politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive
FROM pg_policies 
WHERE tablename LIKE '%attribute%'
ORDER BY tablename, policyname;

-- 6. Diagnostic final
DO $$
DECLARE
    table_count INTEGER;
    attr_count INTEGER;
    config_count INTEGER;
    cat_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name IN ('attribute_types', 'category_attributes', 'product_attributes');
    
    SELECT COUNT(*) INTO attr_count FROM attribute_types WHERE is_active = true;
    SELECT COUNT(*) INTO config_count FROM category_attributes;
    SELECT COUNT(DISTINCT category_id) INTO cat_count FROM category_attributes;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎯 DIAGNOSTIC FINAL:';
    RAISE NOTICE '==================';
    
    IF table_count = 3 THEN
        RAISE NOTICE '✅ Tables: OK (%/3)', table_count;
    ELSE
        RAISE NOTICE '❌ Tables: ERREUR (%/3)', table_count;
    END IF;
    
    IF attr_count >= 5 THEN
        RAISE NOTICE '✅ Attributs: OK (% créés)', attr_count;
    ELSE
        RAISE NOTICE '⚠️ Attributs: INSUFFISANT (% créés)', attr_count;
    END IF;
    
    IF config_count > 0 THEN
        RAISE NOTICE '✅ Configurations: OK (% configs, % catégories)', config_count, cat_count;
    ELSE
        RAISE NOTICE '❌ Configurations: AUCUNE';
    END IF;
    
    RAISE NOTICE '';
    
    IF table_count = 3 AND attr_count >= 5 AND config_count > 0 THEN
        RAISE NOTICE '🎉 SYSTÈME D''ATTRIBUTS: ✅ PRÊT POUR LA PRODUCTION';
        RAISE NOTICE '   → Vous pouvez maintenant tester l''interface /categories/attributs';
        RAISE NOTICE '   → Les attributs sont automatiquement configurés par type de catégorie';
        RAISE NOTICE '   → Couleur, Marque et Matière sont ajoutés à toutes les catégories';
        RAISE NOTICE '   → Taille est ajoutée aux vêtements, Pointure aux chaussures';
    ELSE
        RAISE NOTICE '⚠️ SYSTÈME D''ATTRIBUTS: INSTALLATION INCOMPLÈTE';
        RAISE NOTICE '   → Réexécuter ATTRIBUTES-PRODUCTION-READY.sql';
    END IF;
    
    RAISE NOTICE '';
END $$;