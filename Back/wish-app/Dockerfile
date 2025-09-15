#Prend l’image officielle Node 20 basée sur Alpine Linux
FROM node:20-alpine

# Pour le hot-reload fiable dans Docker
#Active les comportements “dev”
ENV NODE_ENV=development \
    #Forcent les watchers de fichiers (Chokidar/Webpack) à scruter périodiquement
    CHOKIDAR_USEPOLLING=true \
    #le hot-reload détecte bien les changements montés en volume
    WATCHPACK_POLLING=true

#Définit le répertoire de travail à l’intérieur du conteneur
WORKDIR /usr/src/app

# Installer les deps en cache
#Copie uniquement package.json et package-lock.json. Permet d’utiliser le cache Docker
COPY package*.json ./
#Installe les dépendances exactement selon le lockfile; Supprime le dossier node_modules s’il existe déjà
RUN npm ci

#Ecouté sur le port 3000
EXPOSE 3000
#Commande pour démarrer le conteneur NestJS
CMD ["npm", "run", "start:dev"]
