# Sona Mentors Dashboard

This repository is a scaffold for the Symphony Mentors dashboard.

What you get:

- Minimal Next.js + TypeScript app structure
- Prisma schema with basic models (Mentor, School, Visit)
- tRPC server placeholders
- Dockerfile + docker-compose to run the Next app and Postgres locally
- PWA-ready manifest placeholder (you can add icons)

Quickstart (local using Docker):

1. Copy the example env file:

```bash
cp .env.example .env
```

2. Build and start with Docker Compose:

```bash
docker compose up --build
```

3. Inside the `web` container (or locally after npm install), generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Notes:

- This is a scaffold. After `npm install` you can run `npm run dev` locally without Docker for faster iteration.
- The code includes minimal tRPC and Prisma wiring — expand routers and pages to match your domain model.

License: MIT (change in LICENSE if you prefer a different license)

# sona-mentors-dashboard
