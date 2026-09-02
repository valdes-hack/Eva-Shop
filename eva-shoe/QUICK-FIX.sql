-- =====================================================
-- SCRIPT ADMIN - EVA SHOE
-- Instructions pour créer un compte administrateur
-- =====================================================

-- =====================================================
-- ÉTAPE 1: CRÉER VOTRE COMPTE
-- =====================================================
-- 1. Allez sur votre site EVA SHOE
-- 2. Cliquez sur "Créer un compte" 
-- 3. Inscrivez-vous avec votre email
-- 4. Confirmez votre email si nécessaire

-- =====================================================
-- ÉTAPE 2: CHANGER VOTRE RÔLE EN ADMIN
-- =====================================================
-- Remplacez 'VOTRE_EMAIL_ICI' par votre vraie adresse email

UPDATE public.profiles 
SET role = 'admin',
    first_name = COALESCE(first_name, 'Admin'),
    last_name = COALESCE(last_name, 'EVA SHOE'),
    updated_at = NOW()
WHERE email = 'hackv9236@gmail.com';

-- =====================================================
-- ÉTAPE 3: VÉRIFIER QUE LE CHANGEMENT A FONCTIONNÉ
-- =====================================================
-- Vérifier votre nouveau rôle
SELECT 
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
FROM public.profiles 
WHERE email = 'hackv9236@gmail.com';

-- =====================================================
-- ÉTAPE 4: VOIR TOUS LES ADMINS (OPTIONNEL)
-- =====================================================
-- Lister tous les utilisateurs avec rôle admin
SELECT 
    email,
    first_name,
    last_name,
    role,
    created_at
FROM public.profiles 
WHERE role IN ('admin', 'manager')
ORDER BY created_at DESC;

-- =====================================================
-- EXEMPLE COMPLET
-- =====================================================
-- Si votre email est admin@evashoe.com, exécutez ceci :

-- UPDATE public.profiles 
-- SET role = 'admin',
--     first_name = COALESCE(first_name, 'Admin'),
--     last_name = COALESCE(last_name, 'EVA SHOE'),
--     updated_at = NOW()
-- WHERE email = 'admin@evashoe.com';

-- SELECT * FROM public.profiles WHERE email = 'admin@evashoe.com';

-- =====================================================
-- CRÉER D'AUTRES ADMINS (OPTIONNEL)
-- =====================================================
-- Pour promouvoir d'autres utilisateurs :

-- UPDATE public.profiles 
-- SET role = 'admin', updated_at = NOW()
-- WHERE email = 'autre-admin@example.com';

-- Pour créer un manager :
-- UPDATE public.profiles 
-- SET role = 'manager', updated_at = NOW()
-- WHERE email = 'manager@example.com';

-- =====================================================
-- RÉVOQUER LES DROITS ADMIN (SI NÉCESSAIRE)
-- =====================================================
-- Pour remettre un utilisateur en client :

-- UPDATE public.profiles 
-- SET role = 'client', updated_at = NOW()
-- WHERE email = 'utilisateur@example.com';