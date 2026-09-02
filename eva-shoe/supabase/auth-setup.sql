-- =====================================================
-- CONFIGURATION AUTHENTIFICATION - EVA SHOE
-- Tables pour les profils utilisateurs
-- =====================================================

-- 1. TABLE PROFILS UTILISATEURS
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- 2. TABLE ADRESSES DE LIVRAISON
CREATE TABLE IF NOT EXISTS public.addresses (
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

-- 3. INDEX POUR LES PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON public.addresses(is_default);

-- 4. RLS (ROW LEVEL SECURITY)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES RLS

-- Profils : les utilisateurs ne peuvent voir/modifier que leur propre profil
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent insérer leur propre profil" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Adresses : les utilisateurs ne peuvent voir/modifier que leurs propres adresses
CREATE POLICY "Les utilisateurs peuvent voir leurs propres adresses" 
  ON public.addresses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent gérer leurs propres adresses" 
  ON public.addresses FOR ALL 
  USING (auth.uid() = user_id);

-- 6. FONCTION POUR CRÉER UN PROFIL AUTOMATIQUEMENT
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

-- 7. TRIGGER POUR CRÉER LE PROFIL AUTOMATIQUEMENT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. FONCTION POUR METTRE À JOUR LE TIMESTAMP
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. TRIGGERS POUR UPDATED_AT
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. DONNÉES DE TEST (optionnel)
-- Sera créé automatiquement lors de l'inscription