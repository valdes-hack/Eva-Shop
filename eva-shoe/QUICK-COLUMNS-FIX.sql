-- QUICK-COLUMNS-FIX.sql
-- Ajout rapide des colonnes manquantes

-- Ajouter les colonnes SEO et de présentation
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
ADD COLUMN IF NOT EXISTS presentation_text TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- Vérifier les colonnes ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'categories' 
AND column_name IN ('banner_image_url', 'presentation_text', 'seo_keywords')
ORDER BY column_name;

-- Message de confirmation
SELECT 'Colonnes ajoutées avec succès !' as message;