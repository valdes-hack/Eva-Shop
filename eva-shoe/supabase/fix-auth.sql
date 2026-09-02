-- =====================================================
-- CORRECTION AUTHENTIFICATION - EVA SHOE
-- Supprime et recrée les tables utilisateurs correctement
-- =====================================================

-- 1. SUPPRIMER LES POLICIES EXISTANTES (pour éviter les conflits)
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent insérer leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs propres adresses" ON public.addresses;
DROP POLICY IF EXISTS "Les utilisateurs peuvent gérer leurs propres adresses" ON public.addresses;

-- 2. SUPPRIMER LES TABLES SI ELLES EXISTENT (cascade)
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. SUPPRIMER LES FONCTIONS ET TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS handle_addresses_updated_at ON public.addresses;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- 4. CRÉER LA TABLE PROFILS UTILISATEURS
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('homme', 'femme', 'autre')),
  newsletter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRÉER LA TABLE ADRESSES DE LIVRAISON
CREATE TABLE public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('domicile', 'bureau', 'autre')) DEFAULT 'domicile',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'Cameroun',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CRÉER LES INDEX
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX idx_addresses_is_default ON public.addresses(is_default);

-- 7. ACTIVER RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 8. CRÉER LES POLICIES RLS
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own addresses" 
  ON public.addresses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses" 
  ON public.addresses FOR ALL 
  USING (auth.uid() = user_id);

-- 9. CRÉER LA FONCTION POUR CRÉER UN PROFIL AUTOMATIQUEMENT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. CRÉER LE TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. CRÉER LA FONCTION POUR UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. CRÉER LES TRIGGERS UPDATED_AT
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 13. VÉRIFICATION
SELECT 'profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'addresses' as table_name, COUNT(*) as count FROM public.addresses;