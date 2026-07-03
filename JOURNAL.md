# Journal de développement — Site Chokri Benomrane

> Laravel 12 · React · Inertia.js v2 · Vite · Tailwind CSS · PostgreSQL  
> Palette : `#0A0706` bg · `#1c1916` card · `#D4AF37` gold · `#822623` carmin · `#F4EFEA` cream

---

## Fonctionnalités réalisées

### 1. Navigation & Layout public
- `PublicLayout.jsx` — navbar fixe avec hamburger + drawer mobile, bottom nav 4 icônes mobile-only, footer 3 colonnes
- Lien **Chroniques** ajouté dans la nav entre Ateliers et Contact

### 2. Page Contact
- Icônes réseaux sociaux en SVG inline (Instagram, WhatsApp, Facebook) — `stroke="currentColor"`
- Champ **téléphone** 8 chiffres : validation `digits:8` côté Laravel, `replace(/\D/g,'').slice(0,8)` côté React
- Téléphone inclus dans le corps de l'email reçu

### 3. Page Artiste
- Biographie mise à jour avec les vraies informations : fondateur de la **peinture de l'absurde**, professeur & mentor
- Étiquettes Profession / Lieu ajoutées
- 3 cartes Démarche réécrites : Style · Langage pictural · Mission
- Citation centrale mise à jour
- Stats : Tunis · 25+ années · 3 casquettes

### 4. Dashboard Admin
- Carte stats adaptée à la palette sombre (`#0A0706`, `#1c1916`, gold, etc.)
- Cartes : Tableaux · Foires · Cours · Articles (4 accents distincts)
- Bug `handlePlacesTotal` corrigé : `setData(prev => ({ ...prev, ... }))` au lieu de `setData(object)` qui remplace tout l'état Inertia v2

### 5. Cours Admin
- **Bug critique corrigé** : "The jour field is required." même champs remplis  
  → Cause : `setData(object)` en Inertia v2 écrase tout le formulaire (ligne 456-457 du source)  
  → Fix : forme fonctionnelle dans `Create.jsx`, `Edit.jsx`, `Index.jsx`, `Dashboard.jsx`
- Route model binding corrigé : `.parameters(['cours' => 'cour'])`
- Champ `ordre` ajouté au `$fillable` de `Cours.php`
- **Devise changée de € à TND** dans tous les fichiers :
  - `Admin/Cours/Index.jsx` — `formatTarif` + label colonne
  - `Admin/Cours/Create.jsx` — label formulaire
  - `Admin/Cours/Edit.jsx` — label formulaire
  - `Admin/Dashboard.jsx` — formulaire rapide
  - `Ateliers.jsx` — affichage public `${cours.tarif} TND`

### 6. Blog / Chroniques (feature complète)

**Base de données**
- Migration `articles` : `id, titre, contenu, image_data (TEXT base64), image_mime, publie, ordre, timestamps`

**Back-end**
- `Article.php` — scope `publies()`, accesseur `image_url`, cast `publie` boolean
- `ArticleController.php` (admin) — CRUD complet, image base64 encode/decode
- `ImageController.php` — route `/image/article/{article}` servant l'image binaire
- `PageController.php` — `blog()` + `article()` avec Carbon FR (`->locale('fr')->isoFormat(...)`)
- `AdminController.php` — stats `total_articles` + `articles_publies` passées au dashboard

**Routes**
```php
Route::get('/blog', [PageController::class, 'blog'])->name('blog');
Route::get('/blog/{article}', [PageController::class, 'article'])->name('blog.article');
Route::get('/image/article/{article}', [ImageController::class, 'article'])->name('image.article');
Route::resource('articles', AdminArticleController::class); // dans groupe auth admin
```

**Front-end admin**
- `Admin/Articles/Index.jsx` — liste + **modal popup** (create / edit) + **drag & drop** image  
  Pattern : `useState(null)` → `null | 'create' | articleObject`  
  `forceFormData: true` pour l'upload fichier  
  Aperçu image avec dim quand `supprimer_image` coché

**Front-end public**
- `Blog.jsx` — grille `1 → 2 → 3 col`, IntersectionObserver `.reveal-card`, newsletter statique
- `ArticleDetail.jsx` — `max-w-3xl`, `whitespace-pre-wrap`, nav haut/bas
- `AdminLayout.jsx` — lien "Articles / Blog" ajouté dans la sidebar admin

**CSS ajouté**
```css
.reveal-card { opacity:0; transform:translateY(30px); transition:... }
.reveal-card.active { opacity:1; transform:translateY(0); }
.gallery-frame { border: 0.5px solid #D4AF37; }
.btn-primary { background:#D4AF37; color:#0A0706; }
.btn-primary:hover { background:#822623; color:#D4AF37; }
```

### 7. Responsive (audit complet)

**Problèmes corrigés — overflow mobile critique**  
`text-display-lg` = 90px débordait sur écrans 375px (texte coupé par `overflow-hidden`)

| Fichier | Élément | Avant | Après |
|---------|---------|-------|-------|
| `Accueil.jsx` | "CHOKRI" / "BENOMRANE" | `text-display-lg` + `overflow-hidden` | `text-5xl sm:text-7xl lg:text-display-lg` + `overflow-visible` |
| `Ateliers.jsx` | Hero "Ateliers" | `text-display-lg` | `text-5xl sm:text-7xl lg:text-display-lg` |
| `Oeuvres.jsx` | "Galerie" | `text-display-lg` | `text-5xl sm:text-7xl lg:text-display-lg` |
| `Presse.jsx` | "Presse" | `text-display-lg` | `text-5xl sm:text-7xl lg:text-display-lg` |

**Déjà responsive (aucun changement)**
- Navbar : hamburger + drawer mobile, bottom nav 4 icônes
- Grilles : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` partout
- Masonry galerie : `columns: 1 → 2 → 3` via media queries CSS
- Lightbox : `flex-col lg:flex-row`
- Footer : `grid-cols-1 md:grid-cols-3`
- Contact : form `grid-cols-1 md:grid-cols-2`
- Main : `pb-16 md:pb-0` pour dégager la bottom nav mobile

---

## Points techniques importants

### Bug Inertia v2 — `setData(object)` remplace tout
```js
// ❌ Inertia v2 — écrase tout le formulaire
setData({ places_total: val, places_restantes: val });

// ✅ Forme fonctionnelle — fusionne
setData(prev => ({ ...prev, places_total: val, places_restantes: val }));
```
Source confirmé : `node_modules/@inertiajs/react/dist/index.esm.js` lignes 456-457.

### Images binaires en base64
PostgreSQL `TEXT` column + `base64_encode($file->get())` au store, `base64_decode($article->image_data)` au serve. Évite le problème UTF-8 avec `bytea`.

### Dates françaises Carbon
```php
Carbon::parse($article->created_at)->locale('fr')->isoFormat('D MMMM YYYY')
```
Appelé par instance (pas de locale globale dans AppServiceProvider).

### Upload fichier Inertia
```js
post(route, { forceFormData: true, onSuccess: onClose });
```
Requis dès qu'un `File` est dans le formulaire.

---

## Structure des fichiers clés

```
app/
  Http/Controllers/
    Admin/
      ArticleController.php   ← CRUD articles
      CoursController.php     ← CRUD cours (+ fix route binding)
    AdminController.php       ← Dashboard stats
    ImageController.php       ← Serveur images base64
    PageController.php        ← Pages publiques + blog
    ContactController.php     ← Formulaire contact + validation téléphone
  Models/
    Article.php               ← scope publies, accesseur image_url
    Cours.php                 ← ordre dans fillable

database/migrations/
  2026_07_03_000001_create_articles_table.php

resources/js/
  Pages/
    Accueil.jsx               ← Hero responsive fix
    Artiste.jsx               ← Bio réelle, démarche mise à jour
    Oeuvres.jsx               ← Responsive fix
    Ateliers.jsx              ← Devise TND, responsive fix
    Expositions.jsx
    Presse.jsx                ← Responsive fix
    Contact.jsx               ← Téléphone, icônes SVG
    Blog.jsx                  ← Page publique chroniques
    ArticleDetail.jsx         ← Détail article public
    Admin/
      Dashboard.jsx           ← Palette sombre, stats articles, fix setData
      Articles/Index.jsx      ← Modal + drag & drop
      Cours/
        Create.jsx            ← Fix setData, devise TND
        Edit.jsx              ← Fix setData, devise TND
        Index.jsx             ← Fix setData, devise TND, formatTarif TND
  Components/Layout/
    PublicLayout.jsx          ← Nav + drawer + bottom nav + lien Chroniques
    AdminLayout.jsx           ← Lien Articles/Blog
  css/app.css                 ← Classes blog, galerie, masonry, animations
```
