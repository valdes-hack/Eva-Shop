# Système de Catégories Complet - EVA SHOE

## 🎯 Objectif
Implémenter un système de gestion de catégories hiérarchique complet avec interface d'administration moderne, selon les spécifications du cahier des charges fonctionnel.

## 🚫 Problèmes Actuels Identifiés

### 1. **Formulaire de Modification Incomplet**
- ❌ Impossibilité de modifier l'icône des catégories existantes
- ❌ Icônes affichées en emojis au lieu d'icônes SVG professionnelles  
- ❌ Champs SEO non modifiables (meta_title, meta_description, etc.)
- ❌ Image de bannière non modifiable

### 2. **Filtres Dysfonctionnels**
- ❌ Les filtres ne se mettent pas à jour en temps réel
- ❌ Recherche ne fonctionne pas correctement
- ❌ Pagination cassée après filtrage

### 3. **Interface d'Actions Défaillante**  
- ❌ Icône de suppression disparue du tableau
- ❌ Actions en lot non disponibles
- ❌ Pas de mise à jour instantanée après modifications

### 4. **Fonctionnalités Manquantes**
- ❌ Gestion des attributs par catégorie non implémentée
- ❌ Héritage des attributs non géré  
- ❌ Chemin hiérarchique non calculé automatiquement
- ❌ SEO et référencement incomplet

## 📋 Exigences Fonctionnelles

### 1. **Arborescence des Catégories (MUST HAVE)**

#### Structure Hiérarchique Requise:
```
VÊTEMENTS/
├── Homme/
│   ├── Chemises
│   ├── Pantalons  
│   ├── Costumes
│   ├── T-shirts
│   ├── Polo
│   ├── Shorts
│   ├── Vestes
│   ├── Jeans
│   └── Sous-vêtements
├── Femme/
│   ├── Robes
│   ├── Jupes
│   ├── Pantalons
│   ├── T-shirts
│   ├── Chemisiers
│   ├── Vestes
│   ├── Manteaux
│   ├── Jeans
│   ├── Sous-vêtements
│   └── Maillots de bain
└── Enfant/
    ├── Filles (2-12 ans)
    ├── Garçons (2-12 ans)
    └── Bébé (0-2 ans)

CHAUSSURES/
├── Homme/
│   ├── Baskets
│   ├── Derbies
│   ├── Mocassins
│   ├── Sandales
│   ├── Bottes
│   └── Chaussures de sport
├── Femme/
│   ├── Baskets
│   ├── Talons (Escarpins, Sandales)
│   ├── Ballerines
│   ├── Bottes
│   └── Chaussures de sport
└── Enfant/
    ├── Filles (2-12 ans)
    ├── Garçons (2-12 ans)
    └── Bébé (0-2 ans)

ACCESSOIRES/
├── Sacs/
│   ├── Sacs à main
│   ├── Sacs à dos
│   ├── Portefeuilles
│   └── Ceintures
├── Bijoux/
│   ├── Colliers
│   ├── Bracelets
│   ├── Boucles d'oreilles
│   └── Montres
└── Autres/
    ├── Chapeaux
    ├── Casquettes
    ├── Foulards
    ├── Cravates
    └── Lunettes
```

#### Fonctionnalités des Catégories:
- ✅ **Arborescence infinie**: Catégories, sous-catégories, sous-sous-catégories
- ✅ **Catégorie parente**: Chaque catégorie peut avoir une catégorie parente
- ✅ **Ordre d'affichage**: Définition de l'ordre d'affichage des catégories  
- ✅ **Activation/Désactivation**: Une catégorie peut être désactivée (non visible)
- ✅ **Icône/Image**: Ajout d'une icône SVG et image pour la catégorie
- ✅ **Chemin hiérarchique**: Ex: Vêtements > Femme > Robes > Longues

### 2. **Attributs par Catégorie (SHOULD HAVE)**

#### Attributs par Type de Catégorie:
| Catégorie | Attributs Obligatoires | Attributs Optionnels |
|-----------|----------------------|----------------------|
| **Vêtements** | Taille, Couleur | Marque, Matière, Collection, Entretien |
| **Vêtements Homme** | Taille, Couleur | Marque, Matière, Coupe, Style |
| **Vêtements Femme** | Taille, Couleur | Marque, Matière, Coupe, Style, Longueur |
| **Vêtements Enfant** | Taille (2-12 ans), Couleur | Marque, Matière |
| **Chaussures** | Pointure, Couleur | Marque, Matière, Type |
| **Chaussures Homme** | Pointure (35-45), Couleur | Marque, Matière |
| **Chaussures Femme** | Pointure (35-42), Couleur | Marque, Matière, Hauteur talon |
| **Accessoires** | Couleur | Marque, Matière, Type |

#### Héritage des Attributs:
- Les sous-catégories héritent des attributs de la catégorie parente
- Exemple: "Vêtements" a l'attribut "Taille" → toutes les sous-catégories ont "Taille"
- Possibilité de surcharger ou ajouter des attributs spécifiques

### 3. **Référencement SEO (COULD HAVE)**

#### Champs SEO par Catégorie:
| Champ | Description | Exemple |
|-------|-------------|---------|
| **Meta Title** | Titre affiché dans les résultats de recherche | "Robes femme - Acheter en ligne au Cameroun" |
| **Meta Description** | Description pour les résultats de recherche | "Découvrez notre collection de robes femme. Livraison rapide au Cameroun. Paiement Mobile Money sécurisé." |
| **URL personnalisée** | URL de la page catégorie | /categorie/robes-femme |
| **Texte de présentation** | Texte en haut de la page catégorie | Description de la catégorie |
| **Image de bannière** | Image en haut de la page catégorie | Bannière visuelle |
| **Mots-clés SEO** | Mots-clés pour le référencement | "robes, femme, mode, Cameroun" |

## 🛠️ Exigences Techniques

### 1. **Interface d'Administration**
- ✅ **Tableau avec filtres avancés** (recherche, statut, parent, tri)
- ✅ **Actions en lot** (activation, désactivation, suppression)
- ✅ **Glisser-déposer** pour réorganiser l'ordre  
- ✅ **Formulaire multi-onglets** (Général, SEO, Attributs)
- ✅ **Aperçu en temps réel** des modifications
- ✅ **Icônes SVG professionnelles** (pas d'emojis)

### 2. **Performance et UX**  
- ✅ **Chargement lazy** des sous-catégories
- ✅ **Recherche en temps réel** avec debounce
- ✅ **Mise à jour instantanée** après chaque action
- ✅ **Cache intelligent** des requêtes
- ✅ **Validation côté client et serveur**

### 3. **Base de Données**
- ✅ **Triggers automatiques** pour calculer hierarchy_path
- ✅ **Contraintes d'intégrité** (pas de boucles, slugs uniques)
- ✅ **Index optimisés** pour les requêtes fréquentes
- ✅ **Soft delete** (is_active = false au lieu de DELETE)

## 🎨 Spécifications Visuelles

### 1. **Icônes SVG Disponibles**
```typescript
const iconOptions = [
  { value: 'folder', label: 'Dossier' },          // 📁 → SVG
  { value: 'shoe', label: 'Chaussures' },        // 👟 → SVG  
  { value: 'shirt', label: 'Vêtements' },        // 👕 → SVG
  { value: 'bag', label: 'Sacs' },               // 👜 → SVG
  { value: 'watch', label: 'Montres' },          // ⌚ → SVG
  { value: 'glasses', label: 'Lunettes' },       // 👓 → SVG
  { value: 'cap', label: 'Chapeaux' },           // 🧢 → SVG
  { value: 'belt', label: 'Ceintures' },         // 👔 → SVG
  { value: 'jewelry', label: 'Bijoux' },         // ✨ → SVG
  { value: 'star', label: 'Favoris' }            // ⭐ → SVG
]
```

### 2. **Couleurs de Thème**
- **Primary**: #C89B3C (doré EVA SHOE)
- **Success**: #10B981 (vert)
- **Warning**: #F59E0B (orange) 
- **Error**: #EF4444 (rouge)
- **Neutral**: #6B7280 (gris)

## ✅ Critères d'Acceptation

### 1. **Modification Complète**
- [ ] Je peux modifier TOUS les champs d'une catégorie existante
- [ ] Les icônes sont affichées en SVG, pas en emojis
- [ ] Je peux changer l'icône visuellement avec la grille  
- [ ] Les champs SEO sont modifiables et sauvegardés
- [ ] L'image de bannière est modifiable avec aperçu

### 2. **Filtres Fonctionnels**
- [ ] La recherche filtre en temps réel
- [ ] Les filtres de statut fonctionnent  
- [ ] La pagination fonctionne avec les filtres
- [ ] Le tableau se met à jour instantanément après chaque action

### 3. **Actions Complètes**
- [ ] L'icône de suppression est visible et fonctionne
- [ ] Actions en lot disponibles (sélection multiple)
- [ ] Confirmation avant suppression
- [ ] Mise à jour automatique du cache après modifications

### 4. **Hiérarchie et Attributs**
- [ ] Le chemin hiérarchique est calculé automatiquement
- [ ] Les attributs sont assignables par catégorie
- [ ] L'héritage des attributs fonctionne
- [ ] La structure complète peut être créée (Vêtements > Femme > Robes...)

## 🚀 Ordre d'Implémentation

1. **Phase 1**: Corriger le formulaire avec icônes SVG
2. **Phase 2**: Réparer les filtres et actions du tableau  
3. **Phase 3**: Implémenter la gestion des attributs
4. **Phase 4**: Compléter le SEO et référencement
5. **Phase 5**: Tests et optimisations finales

## 📊 Métriques de Succès

- ✅ **100% des champs modifiables** dans le formulaire
- ✅ **0 emoji**, que des icônes SVG professionnelles
- ✅ **Filtres instantanés** (< 200ms de délai)
- ✅ **Actions visibles** et fonctionnelles à 100%
- ✅ **Structure complète créable** selon le CdCF