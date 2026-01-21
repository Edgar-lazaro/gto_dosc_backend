# syntax=docker/dockerfile:1

# Build stage
FROM node:22-bookworm-slim AS build
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources
COPY tsconfig*.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

# Prisma client + build
RUN npx prisma generate
RUN npm run build

# Prune dev deps for runtime
RUN npm prune --omit=dev


# Runtime stage
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# uploads is created at runtime by the app; mount a volume for persistence.
EXPOSE 3000

CMD ["node", "dist/main.js"]
