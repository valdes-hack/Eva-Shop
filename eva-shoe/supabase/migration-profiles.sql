-- =====================================================
-- MIGRATION DE LA TABLE PROFILES - EVA SHOE
-- Mise à jour de la structure existante
-- =====================================================

-- 1. AJOUTER LES COLONNES MANQUANTES À LA TABLE PROFILES EXISTANTE
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'manager'));

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- 2. METTRE À JOUR LA STRUCTURE DE LA TABLE ADDRESSES
-- Supprimer les anciennes colonnes si elles existent
ALTER TABLE public.addresses DROP COLUMN IF EXISTS first_name;
ALTER TABLE public.addresses DROP COLUMN IF EXISTS last_name;
ALTER TABLE public.addresses DROP COLUMN IF EXISTS phone;
ALTER TABLE public.addresses DROP COLUMN IF EXISTS address_line_1;
ALTER TABLE public.addresses DROP COLUMN IF EXISTS address_line_2;
ALTER TABLE public.addresses DROP COLUMN IF EXISTS postal_code;

-- Ajouter les nouvelles colonnes selon le nouveau schéma
ALTER TABLE public.addresses 
ADD COLUMN IF NOT EXISTS address_line TEXT NOT NULL DEFAULT 'Adresse à compléter';

ALTER TABLE public.addresses 
ADD COLUMN IF NOT EXISTS postal_code TEXT;

ALTER TABLE public.addresses 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'both' CHECK (type IN ('shipping', 'billing', 'both'));

-- 3. METTRE À JOUR LES CONTRAINTES
-- Supprimer l'ancienne contrainte sur country si elle existe
ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS addresses_country_check;

-- Rendre la colonne country NOT NULL si ce n'est pas déjà le cas
ALTER TABLE public.addresses 
ALTER COLUMN country SET DEFAULT 'Cameroun';

UPDATE public.addresses SET country = 'Cameroun' WHERE country IS NULL;

ALTER TABLE public.addresses 
ALTER COLUMN country SET NOT NULL;

-- 4. AJOUTER LES COLONNES EMAIL SI MANQUANTE DANS PROFILES
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Mettre à jour l'email depuis auth.users si nécessaire
UPDATE public.profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE public.profiles.id = auth.users.id 
  AND public.profiles.email IS NULL;

-- 5. CRÉER L'INDEX SUR LE RÔLE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 6. VÉRIFICATION DE LA STRUCTURE MISE À JOUR
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;