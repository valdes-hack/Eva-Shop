-- =====================================================
-- CORRECTION DES POLITIQUES RLS - TABle CATEGORIES
-- À exécuter dans le Supabase SQL Editor
-- =====================================================

-- 1. Activer RLS sur la table categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Public categories read access" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated full access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anon insert access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anon update access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anon delete access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow all for categories" ON public.categories;

-- 3. Politique de lecture publique (Lecture autorisée pour tous)
CREATE POLICY "Allow public read access to categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- 4. Politique d'insertion (Autoriser l'insertion)
CREATE POLICY "Allow insert access to categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (true);

-- 5. Politique de mise à jour (Autoriser la modification)
CREATE POLICY "Allow update access to categories"
  ON public.categories
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 6. Politique de suppression (Autoriser la suppression)
CREATE POLICY "Allow delete access to categories"
  ON public.categories
  FOR DELETE
  USING (true);

-- Vérification des politiques configurées
SELECT tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'categories';
