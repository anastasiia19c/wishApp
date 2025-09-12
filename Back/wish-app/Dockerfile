FROM node:20-alpine

# Pour le hot-reload fiable dans Docker
ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true

WORKDIR /usr/src/app

# Installer les deps en cache
COPY package*.json ./
RUN npm ci


EXPOSE 3000
CMD ["npm", "run", "start:dev"]
