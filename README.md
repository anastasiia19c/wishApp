# 🌟 Wish’App — Gestion de listes de souhaits & réservation de cadeaux

Application mobile (React Native / Expo) + Backend NestJS + MongoDB

---

## 📌 Présentation

Wish’App est une application permettant de créer, partager et gérer des listes de souhaits (wishlists) pour divers événements : anniversaires, mariages, naissances, fêtes…

L’objectif est double :

- simplifier la gestion des cadeaux pour le propriétaire de la wishlist
- faciliter le choix des invités en évitant les doublons et les cadeaux inutiles

---

## 🎯 Objectifs de l'application

Wish’App offre la possibilité :

- d’augmenter les chances pour l’utilisateur de recevoir des cadeaux réellement utiles
- d’aider les invités à trouver des idées pertinentes
- de simplifier toute l’organisation autour d’un événement
- de suivre les réservations et les contributions

---

## 👥 Acteurs de l'application

### Propriétaire (Owner)

Le propriétaire doit disposer d’un compte et peut :

- créer, consulter, modifier et supprimer ses wishlists et leurs articles
- partager chaque wishlist via un lien unique par invité
- consulter les statistiques (cadeaux offerts, reçus, wishlists fermées)
- activer l’option **voir les réservations** et **voir le réservant**

### Invité (Guest)

Un invité peut utiliser l’application sans compte, ou se connecter.

Il peut :

- accéder à une wishlist via un lien unique
- consulter les articles disponibles
- réserver jusqu’à 3 cadeaux
- si authentifié, consulter la liste des cadeaux qu'il a déjà réservés
- accéder à des statistiques personnelles
- copier les cadeaux choisis dans sa propre wishlist (si connecté)

---

## 🧩 Fonctionnalités principales (MVP)

- Création de compte et authentification  
- Création / consultation / modification / suppression de wishlists  
- Ajout, édition et suppression d’items  
- Génération d’un lien de partage unique  
- Consultation d’une wishlist partagée  
- Réservation d’items (limite : 3 cadeaux / invité)  
- Masquage automatique des cadeaux déjà réservés  
- Protection des routes selon rôle (owner / guest)

---

## 🚀 MVP+

- Affichage des items réservés pour le propriétaire  
- Affichage du nom/pseudo du réservant  
- Filtrage des items par prix (owner & guest)  
- Historique des réservations  
- Copier un cadeau réservé dans la liste personnelle  
- Synchronisation hors-ligne (React Native + AsyncStorage)  
- Mise à jour en temps réel via WebSockets

---

## 🔐 Gestion du Token & Protection des routes

Wish’App fonctionne avec un token JWT, utilisé pour protéger les routes backend.

- Si un utilisateur est **owner**, il ne peut pas accéder à la page de réservation.
- Si un utilisateur est **guest**, il ne peut pas accéder aux pages réservées aux owners.

Chaque route vérifie le token et le rôle associé (`owner`, `guest`, ou `admin`).

---

## 🧱 Structure du projet

wishApp/
│
├── Back/wish-app/ → Backend NestJS
│ ├── src/ → Modules, contrôleurs et services
│ ├── test/ → Tests unitaires
│ ├── Dockerfile → Image Docker backend
│ ├── .eslintrc.js → ESLint config
│ ├── .prettierrc → Prettier config
│ └── package*.json → Dépendances & scripts
│
├── Front/wishApp/ → Application mobile React Native (Expo)
│ ├── app/ → Navigation & écrans
│ ├── components/ → Composants réutilisables
│ ├── assets/ → Images, fonts…
│ ├── hooks/ → Hooks personnalisés
│ ├── scripts/ → Scripts diverses
│ ├── eslint.config.js → Configuration ESLint
│ └── app.json → Configuration Expo
│
├── docker-compose-dev.yml → Déploiement NestJS + MongoDB
├── init-mongo.js → Initialisation de la base MongoDB
└── README.md → Documentation du projet


---

## 🛠️ IDE & outils utilisés

Développement réalisé avec Visual Studio Code et les plugins :

- **ESLint** : analyse, linter, bonnes pratiques
- **Prettier** : formatage automatique

### Lint & Format Backend

```bash
npm run lint
npx prettier --write .
Lint & Format Frontend
bash
Copier le code
npm run lint
npx prettier --write .
🌿 Branches Git
main → production

develop → développement principal

PRO403-X-nom-de-la-tache → features

Types de commits
feat: nouvelle fonctionnalité

fix: correction

style: apparence

perf: performance

BREAKING: modification majeure

refactor: amélioration du code

chore: maintenance

📎 Liens Projet
🐙 GitHub : https://github.com/anastasiia19c/wishApp

📌 Jira : Gestion du projet

🧪 Installation & lancement du projet
1️⃣ Cloner le projet
bash
Copier le code
git clone https://github.com/anastasiia19c/wishApp.git
2️⃣ Installer les dépendances
Backend (NestJS)
bash
Copier le code
cd Back/wish-app
npm install
Frontend (React Native)
bash
Copier le code
cd Front/wishApp
npm install
3️⃣ Lancer l’environnement de développement
Backend (NestJS + MongoDB via Docker)
bash
Copier le code
docker compose -f docker-compose-dev.yml --env-file .env.dev up -d --build
Frontend (Expo)
bash
Copier le code
npm run start
