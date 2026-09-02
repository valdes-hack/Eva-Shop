# 🔐 Configuration Authentification EVA SHOE

## 📋 Étapes d'installation

### 1. Configuration Base de Données

1. **Exécutez le script principal de BD** :
   ```sql
   -- Copiez et exécutez le contenu de supabase/bd.sql dans Supabase SQL Editor
   ```

2. **Initialisez l'authentification** :
   ```sql
   -- Copiez et exécutez le contenu de supabase/init-auth.sql dans Supabase SQL Editor
   ```

### 2. Variables d'environnement

Vérifiez que votre fichier `.env.local` contient :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=EVA SHOE
```

### 3. Installation et démarrage

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🧪 Test de l'authentification

### Pages disponibles :

- **Inscription** : `http://localhost:3000/register`
- **Connexion** : `http://localhost:3000/login`
- **Mot de passe oublié** : `http://localhost:3000/forgot-password`
- **Accueil** : `http://localhost:3000`

### Scénario de test :

1. **Créer un compte** :
   - Aller sur `/register`
   - Remplir le formulaire (prénom, nom, email, téléphone, mot de passe)
   - Cliquer sur "Créer mon compte"
   - Vérifier la redirection vers la page de vérification email

2. **Se connecter** :
   - Si email confirmé automatiquement, aller sur `/login`
   - Saisir email et mot de passe
   - Vérifier la connexion et la redirection vers l'accueil

3. **Vérifier le profil** :
   - Une fois connecté, cliquer sur "Mon compte" dans le header
   - Vérifier que les informations s'affichent correctement
   - Tester le menu déroulant

## 🛠️ Structure créée

### Fichiers d'authentification :
```
src/
├── app/(auth)/
│   ├── layout.tsx           ✅ Layout auth avec logo
│   ├── login/page.tsx       ✅ Page connexion
│   ├── register/page.tsx    ✅ Page inscription
│   ├── forgot-password/page.tsx ✅ Mot de passe oublié
│   └── verify-email/page.tsx ✅ Vérification email
├── lib/
│   ├── hooks/
│   │   └── use-auth.ts      ✅ Hook authentification
│   ├── services/
│   │   ├── auth.service.ts  ✅ Services auth
│   │   └── user.service.ts  ✅ Services utilisateur
│   ├── supabase/
│   │   ├── client.ts        ✅ Client Supabase
│   │   ├── server.ts        ✅ Serveur Supabase
│   │   ├── admin.ts         ✅ Admin Supabase
│   │   └── middleware.ts    ✅ Middleware auth
│   ├── types/
│   │   └── auth.types.ts    ✅ Types TypeScript
│   └── validations/
│       └── auth.validations.ts ✅ Validation Zod
└── components/
    ├── auth/
    │   ├── login-form.tsx   ✅ Formulaire connexion
    │   └── register-form.tsx ✅ Formulaire inscription
    └── layout/
        └── user-menu.tsx   ✅ Menu utilisateur
```

### Scripts SQL :
```
supabase/
├── bd.sql              ✅ Schéma complet BD
├── init-auth.sql       ✅ Configuration auth
├── auth-setup.sql      ✅ Setup alternatif
└── migration-profiles.sql ✅ Migration profils
```

## ✅ Fonctionnalités implémentées

- [x] **Inscription** avec validation complète
- [x] **Connexion** avec "Se souvenir de moi"
- [x] **Mot de passe oublié** avec email de récupération
- [x] **Création automatique du profil** via trigger
- [x] **Gestion des rôles** (client, admin, manager)
- [x] **Protection des routes** via middleware
- [x] **Menu utilisateur** avec dropdown
- [x] **Hook React** pour l'état auth
- [x] **Types TypeScript** complets
- [x] **Validation Zod** robuste
- [x] **RLS Supabase** activé

## 🐛 Dépannage

### Erreurs communes :

1. **"Table profiles doesn't exist"** :
   - Exécutez d'abord `bd.sql` puis `init-auth.sql`

2. **"Invalid API key"** :
   - Vérifiez vos clés dans `.env.local`
   - Redémarrez le serveur de dev

3. **"Profile not created"** :
   - Vérifiez que le trigger `on_auth_user_created` existe
   - Regardez les logs dans Supabase

4. **Erreur de middleware** :
   - Vérifiez que `middleware.ts` est à la racine de `src/`

### Vérifications BD :

```sql
-- Vérifier que la table profiles existe
SELECT * FROM information_schema.tables 
WHERE table_name = 'profiles';

-- Vérifier le trigger
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Tester un profil
SELECT * FROM profiles WHERE id = 'user_id_test';
```

## 🚀 Prêt pour les tests !

L'authentification est maintenant complètement fonctionnelle et adaptée à votre base de données. Vous pouvez commencer à tester l'inscription et la connexion.