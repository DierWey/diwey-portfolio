# Diwey.dev — Portfolio

Portfolio de Didier Wey, développeur frontend — brief, identité visuelle,
design system, développement et mise en ligne, fait de bout en bout.

**Site en ligne : https://diwey.dev**

Réalisé en formation Intégrateur Web (OpenClassrooms, 2025-2026).

## Stack

- React 19 + Vite
- Sass, architecture en couches : reset → tokens → base → composants
- React Router (accueil, portfolio, fiches projet, contact, mentions légales,
  confidentialité, page 404)
- Données des projets séparées de l'UI (`src/data/projects.json`)

## Lancer le projet en local

Prérequis : Node.js (version LTS recommandée).

```bash
npm install
npm run dev
```

Vite ouvre le site dans le navigateur par défaut (http://localhost:5173).

## Build de production

```bash
npm run build
```

Génère le site optimisé dans `dist/` (jamais committé — le repo contient
les sources, le déploiement construit le bundle).

## Déploiement continu

Chaque push sur la branche `main` déclenche le workflow GitHub Actions
(`deploy.yml`) : installation des dépendances, build Vite, puis transfert
SFTP du contenu de `dist/` vers l'hébergement mutualisé OVH
(`www/` de diwey.dev).

- Les identifiants FTP vivent dans les secrets GitHub
  (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`) — jamais dans le repo.
- Un `.htaccess` à la racine du site sert l'application sur toute route
  inconnue (liens profonds de la SPA) ; l'application React assume la
  page 404.
- Déploiement manuel possible en uploadant le contenu de `dist/` via SFTP
  (FileZilla) — c'est la procédure qui a servi pour la première mise en ligne.

## Crédits

- Typographies : IBM Plex Serif (titres), Inter (texte), JetBrains Mono
  (labels et interface) — Google Fonts, licences SIL OFL.
- Hébergement : OVH. Site statique, zéro cookie, zéro traceur.