-- =====================================================
-- INITIALISATION AUTHENTIFICATION - EVA SHOE
-- Script complet pour configurer l'auth avec votre BD
-- =====================================================

-- 1. CRÉER LA FONCTION POUR GÉRER LES NOUVEAUX UTILISATEURS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_phone TEXT;
BEGIN
  -- Récupérer l'email depuis auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- Récupérer les métadonnées
  user_first_name := NEW.raw_user_meta_data->>'first_name';
  user_last_name := NEW.raw_user_meta_data->>'last_name';
  user_phone := NEW.raw_user_meta_data->>'phone';

  -- Insérer dans la table profiles
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    role
  ) VALUES (
    NEW.id,
    user_email,
    user_first_name,
    user_last_name,
    user_phone,
    'client'
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais continuer
    RAISE WARNING 'Erreur lors de la création du profil: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CRÉER LE TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. ACTIVER RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 4. SUPPRIMER LES ANCIENNES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can manage own addresses" ON public.addresses;

-- 5. CRÉER LES POLICIES POUR LES PROFILS
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 6. CRÉER LES POLICIES POUR LES ADRESSES
CREATE POLICY "Users can view own addresses" 
  ON public.addresses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" 
  ON public.addresses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" 
  ON public.addresses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" 
  ON public.addresses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 7. CRÉER DES POLICIES POUR LES ADMINS (accès à tout)
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- 8. VÉRIFIER QUE LA TABLE PROFILES EXISTE ET A LA BONNE STRUCTURE
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    RAISE EXCEPTION 'Table profiles n''existe pas. Veuillez d''abord exécuter le script bd.sql';
  END IF;
END $$;

-- 9. TESTER LA CONFIGURATION (optionnel - commenté pour la production)
-- SELECT 'Configuration authentification terminée avec succès' as status;

-- 10. INSTRUCTIONS POUR TESTER
/*
Pour tester l'authentification :

1. Exécutez ce script dans Supabase SQL Editor
2. Démarrez votre app Next.js : npm run dev
3. Allez sur http://localhost:3000/register
4. Créez un compte de test
5. Vérifiez que le profil est créé automatiquement dans la table profiles

En cas d'erreur, vérifiez :
- Les variables d'environnement dans .env.local
- Que la table profiles existe dans votre BD
- Les logs dans la console Next.js
*/