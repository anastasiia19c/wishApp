# Étape de base (commune)
FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

# Étape builder (compilation TS → JS)
FROM base AS builder
COPY . .
RUN npm run build

##################################
# Étape PROD
##################################
FROM node:20-alpine AS app_prod
WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]

##################################
# Étape DEV
##################################
FROM base AS app_dev
WORKDIR /usr/src/app

ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true

COPY . .

EXPOSE 4000
CMD ["npm", "run", "start:dev"]
