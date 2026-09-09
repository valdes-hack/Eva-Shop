-- Script pour ajouter des catégories de test à EVA SHOE
-- Exécutez ce script dans Supabase SQL Editor

-- D'abord, supprimer les produits qui référencent les catégories pour éviter la contrainte FK
DELETE FROM products WHERE category_id IS NOT NULL;

-- Ensuite, supprimer les catégories existantes 
DELETE FROM categories;

-- Insérer des catégories principales avec des IDs fixes pour référence
INSERT INTO categories (id, name, slug, description, parent_id, icon, display_order, is_featured, is_active, meta_title, meta_description, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Chaussures', 'chaussures', 'Découvrez notre collection complète de chaussures pour tous les styles', NULL, '👟', 1, true, true, 'Chaussures - EVA SHOE', 'Collection complète de chaussures tendance pour homme et femme', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Vêtements', 'vetements', 'Mode et tendance avec notre sélection de vêtements', NULL, '👕', 2, true, true, 'Vêtements - EVA SHOE', 'Collection de vêtements mode et tendance', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Accessoires', 'accessoires', 'Complétez votre look avec nos accessoires', NULL, '👜', 3, false, true, 'Accessoires - EVA SHOE', 'Accessoires de mode et maroquinerie', NOW(), NOW());

-- Insérer des sous-catégories pour Chaussures
INSERT INTO categories (name, slug, description, parent_id, icon, display_order, is_featured, is_active, meta_title, meta_description, created_at, updated_at) VALUES
('Sneakers', 'sneakers', 'Baskets et sneakers tendance', '11111111-1111-1111-1111-111111111111', '👟', 1, true, true, 'Sneakers - EVA SHOE', 'Collection de sneakers et baskets tendance', NOW(), NOW()),
('Sandales', 'sandales', 'Sandales pour toutes les occasions', '11111111-1111-1111-1111-111111111111', '👡', 2, false, true, 'Sandales - EVA SHOE', 'Sandales confortables et élégantes', NOW(), NOW()),
('Bottes', 'bottes', 'Bottes et boots pour l''hiver', '11111111-1111-1111-1111-111111111111', '🥾', 3, false, true, 'Bottes - EVA SHOE', 'Collection de bottes et boots', NOW(), NOW()),
('Chaussures de sport', 'chaussures-sport', 'Pour vos activités sportives', '11111111-1111-1111-1111-111111111111', '⚽', 4, false, true, 'Chaussures de sport - EVA SHOE', 'Chaussures pour le sport et fitness', NOW(), NOW());

-- Insérer des sous-catégories pour Vêtements
INSERT INTO categories (name, slug, description, parent_id, icon, display_order, is_featured, is_active, meta_title, meta_description, created_at, updated_at) VALUES
('T-shirts', 't-shirts', 'T-shirts et tops pour tous les styles', '22222222-2222-2222-2222-222222222222', '👕', 1, true, true, 'T-shirts - EVA SHOE', 'Collection de t-shirts et tops', NOW(), NOW()),
('Pantalons', 'pantalons', 'Pantalons et jeans tendance', '22222222-2222-2222-2222-222222222222', '👖', 2, false, true, 'Pantalons - EVA SHOE', 'Pantalons, jeans et bas', NOW(), NOW()),
('Robes', 'robes', 'Robes élégantes pour femmes', '22222222-2222-2222-2222-222222222222', '👗', 3, true, true, 'Robes - EVA SHOE', 'Collection de robes pour toutes occasions', NOW(), NOW()),
('Vestes', 'vestes', 'Vestes et manteaux', '22222222-2222-2222-2222-222222222222', '🧥', 4, false, true, 'Vestes - EVA SHOE', 'Vestes, blazers et manteaux', NOW(), NOW());

-- Insérer des sous-catégories pour Accessoires
INSERT INTO categories (name, slug, description, parent_id, icon, display_order, is_featured, is_active, meta_title, meta_description, created_at, updated_at) VALUES
('Sacs', 'sacs', 'Sacs à main et maroquinerie', '33333333-3333-3333-3333-333333333333', '👜', 1, true, true, 'Sacs - EVA SHOE', 'Sacs à main et maroquinerie de qualité', NOW(), NOW()),
('Montres', 'montres', 'Montres et bijoux', '33333333-3333-3333-3333-333333333333', '⌚', 2, false, true, 'Montres - EVA SHOE', 'Collection de montres tendance', NOW(), NOW()),
('Lunettes', 'lunettes', 'Lunettes de soleil et de vue', '33333333-3333-3333-3333-333333333333', '👓', 3, false, true, 'Lunettes - EVA SHOE', 'Lunettes de soleil et optique', NOW(), NOW()),
('Ceintures', 'ceintures', 'Ceintures en cuir et tissu', '33333333-3333-3333-3333-333333333333', '👔', 4, false, true, 'Ceintures - EVA SHOE', 'Ceintures de qualité pour homme et femme', NOW(), NOW());

-- Ajouter une catégorie masquée pour tester
INSERT INTO categories (name, slug, description, parent_id, icon, display_order, is_featured, is_active, meta_title, meta_description, created_at, updated_at) VALUES
('Collection Hiver', 'collection-hiver', 'Collection hiver (temporairement masquée)', NULL, '❄️', 10, false, false, 'Collection Hiver - EVA SHOE', 'Collection spéciale hiver', NOW(), NOW());

-- Vérification : Compter les catégories créées
SELECT 
  'Total catégories' as type, 
  COUNT(*) as count 
FROM categories
UNION ALL
SELECT 
  'Catégories principales' as type, 
  COUNT(*) as count 
FROM categories 
WHERE parent_id IS NULL
UNION ALL
SELECT 
  'Sous-catégories' as type, 
  COUNT(*) as count 
FROM categories 
WHERE parent_id IS NOT NULL
UNION ALL
SELECT 
  'Catégories actives' as type, 
  COUNT(*) as count 
FROM categories 
WHERE is_active = true
UNION ALL
SELECT 
  'Catégories masquées' as type, 
  COUNT(*) as count 
FROM categories 
WHERE is_active = false;

-- Afficher toutes les catégories créées
SELECT 
  c.name,
  c.slug,
  COALESCE(p.name, 'Aucune') as parent,
  c.icon,
  c.display_order,
  CASE WHEN c.is_featured THEN 'Oui' ELSE 'Non' END as featured,
  CASE WHEN c.is_active THEN 'Active' ELSE 'Masquée' END as status
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id
ORDER BY c.display_order, c.name;