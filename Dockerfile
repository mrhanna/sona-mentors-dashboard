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
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

USER node
CMD ["npm", "run", "dev"]