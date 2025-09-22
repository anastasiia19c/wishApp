# Étape de base (commune) -> Image légère Node 20 -> étape "base"
FROM node:20-alpine AS base
#Définit le dossier de travail
WORKDIR /usr/src/app
#Copie package.json + lock
COPY package*.json ./
#Installe les dépendances
RUN npm ci

# Étape builder (compilation TS → JS)
FROM base AS builder
#Copie tout le projet
COPY . .
#Compile TypeScript → JavaScript dans /dist
RUN npm run build

##################################
# Étape PROD
##################################
#Nouvelle image propre pour la prod
FROM node:20-alpine AS app_prod
#Dossier de travail
WORKDIR /usr/src/app
# Active le mode production
ENV NODE_ENV=production
# Copie seulement le code compilé
COPY --from=builder /usr/src/app/dist ./dist
# Copie les dépendances
COPY --from=base /usr/src/app/node_modules ./node_modules
# Port exposé en prod
EXPOSE 3000
# Commande de lancement en prod
CMD ["node", "dist/main.js"]

##################################
# Étape DEV
##################################
# Repart de l'étape "base"
FROM base AS app_dev
# Dossier de travail
WORKDIR /usr/src/app
# Hot-reload fiable (watch fichiers)
ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true
# Copie tout le projet (code source)
COPY . .
# Port exposé en dev
EXPOSE 4000
# Lancement en mode dev (watch/reload)
CMD ["npm", "run", "start:dev"]
