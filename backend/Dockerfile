# ---------- зависимости ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# только production-зависимости: express, mssql, cors...
RUN npm ci --omit=dev

# ---------- runtime ----------
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
# миграции кладём в образ, чтобы при необходимости накатить их вручную:
#   docker exec <container> sh -c "..." или скопировать наружу
COPY sql ./sql

# не запускаемся от root
USER node

EXPOSE 4000
CMD ["node", "src/server.js"]
