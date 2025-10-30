# Stage 1: Dependencies
FROM node:lts-bullseye-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN chown -R node:node /app

USER node
RUN npm ci --silent

# Stage 2: Development
FROM node:lts-bullseye-slim AS dev

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --chown=node:node . .
COPY --from=deps /app/node_modules ./node_modules
RUN chown node:node /app/node_modules

USER node
CMD ["npm", "run", "dev"]