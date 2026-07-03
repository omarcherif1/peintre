# Peintre — Site vitrine Chokri Benomrane

Site vitrine d'un artiste peintre tunisien, fondateur de la peinture de l'absurde.

## Stack technique

- **Back-end** : Laravel 12 (PHP)
- **Front-end** : React + Inertia.js v2 + Vite
- **CSS** : Tailwind CSS
- **Base de données** : PostgreSQL
- **Fonts** : Playfair Display · DM Mono · Lato

## Fonctionnalités

### Pages publiques
- **Accueil** — Hero animé (GSAP clip-reveal), galerie œuvres récentes, carousel ateliers, citation
- **L'Artiste** — Biographie, démarche artistique (peinture de l'absurde), galerie portraits
- **Galerie** — Masonry grid peintures & dessins, lightbox avec cadre doré, fiche technique
- **Expositions** — Hero foire à venir avec countdown, timeline expositions passées, newsletter
- **Presse** — Articles & critiques, interviews, carousel témoignages
- **Ateliers** — Cours disponibles avec places, tarif (TND), inscription via contact
- **Chroniques** — Blog avec articles publiés, page détail article
- **Contact** — Formulaire (nom, email, téléphone 8 chiffres, sujet, message) + envoi email

### Interface admin (authentifiée)
- Dashboard avec statistiques (tableaux, foires, cours, articles)
- CRUD **Tableaux** — upload images multiples, technique, dimensions, disponibilité
- CRUD **Foires / Expositions** — image, dates, emplacement, description
- CRUD **Cours / Ateliers** — jour, horaires, niveau, places, tarif TND, ordre
- CRUD **Articles / Blog** — éditeur texte, upload image drag & drop, publication, ordre
- Formulaires en **modal popup** avec **drag & drop** pour les images

## Palette graphique

| Rôle | Couleur |
|------|---------|
| Fond principal | `#0A0706` |
| Carte | `#1c1916` |
| Or (accent) | `#D4AF37` |
| Carmin (accent 2) | `#822623` |
| Texte clair | `#F4EFEA` |
| Muted | `#7a6a5a` |

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/omarcherif1/peintre.git
cd peintre

# Dépendances PHP
composer install

# Dépendances JS
npm install

# Configuration
cp .env.example .env
php artisan key:generate

# Base de données (PostgreSQL)
# Renseigner DB_* dans .env, puis :
php artisan migrate

# Build assets
npm run build

# Serveur de dev
php artisan serve
npm run dev
```

## Variables d'environnement (.env)

```env
APP_NAME=Peintre
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=peintre
DB_USERNAME=...
DB_PASSWORD=...

MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_FROM_ADDRESS=contact@chokribenomrane.com
```

## Structure principale

```
app/Http/Controllers/
  Admin/          <- Controllers admin (Cours, Articles, Tableaux, Foires)
  PageController  <- Pages publiques
  ContactController
  ImageController <- Serveur images base64

resources/js/
  Pages/          <- Pages React (Inertia)
  Components/Layout/
    PublicLayout  <- Nav + Drawer mobile + Bottom nav + Footer
    AdminLayout   <- Sidebar admin
```

## Auteur

Développé pour **Chokri Benomrane** — Artiste peintre tunisien, Tunis, Tunisie.
