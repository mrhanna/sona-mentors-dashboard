# SoNA Mentors Dashboard

This is a developer-focused scaffold for the Symphony Mentors Dashboard — a small web app to manage mentor visits, school scheduling, and service allocations for the Symphony education program.

I built this as a compact, portfolio-style project that demonstrates full-stack patterns: a Next.js + TypeScript frontend, a type-safe tRPC server, and a Prisma + PostgreSQL backend. The repo includes Docker dev tooling so you can spin up the app and a local Postgres database quickly.

Tech stack

- Next.js (React + TypeScript)
- tRPC for end-to-end typed APIs
- Prisma ORM + PostgreSQL
- Docker + docker-compose for local development

## Docs

### Schema

This project uses Prisma to model the domain. Below is a quick, informal
summary of the main models and the intent behind important fields. Use this
as a reference when extending business logic or writing migrations.

- User

  - Auth account used by Directors, Admins, and optionally Mentors.
  - Key fields: `email`, `role` (ADMIN|DIRECTOR|MENTOR), `passwordHash`.
  - Metadata relations: `visitsCreated`, `visitsConfirmed`, `createdClassTimes`, `createdClassTimeExceptions` — audit links (who created or confirmed records).

- Mentor

  - Domain entity representing a visiting mentor (instrumentalist, etc.).
  - Optional one-to-one link to `User` when a mentor has an auth account.
  - `mentorSchools` is the explicit join to `School` (see `MentorSchool`).

- Director

  - A small domain wrapper mapping a `User` to director-specific info.
  - `userId` is unique (one Director per auth user). Directors can be
    associated with multiple `School` records.

- School

  - Represents a (possibly logical) school. In practice a single physical
    school may have multiple records (e.g. Rogers (Band) vs Rogers (Orchestra)).
  - `timezone` (IANA string) is used when interpreting class times.
  - `servicesAllocated` is the total number of services the Ed director
    grants to the school for the current period.

- MentorSchool (join)

  - Explicit join model between `Mentor` and `School`.
  - `allotments` stores how many services from the school's total are
    allotted to that mentor.

- ClassTime

  - Recurring class-time template using RFC5545 `rrule` + `dtstart` + `durationMinutes`.
  - `maxConcurrentMentors` caps how many mentors may attend a class at once.
  - `createdBy` is metadata (who created the template).
  - Use a recurrence library (rrule.js, ical) in the business layer to
    expand rules into concrete occurrences for a date range.

- ClassTimeException

  - Per-occurrence overrides/cancellations for `ClassTime` (CANCELLED or
    MODIFIED). Business logic should apply these when expanding recurrences.

- Visit
  - Represents an actual mentor visit to a school on a date.
  - `classTimes` is a many-to-many: one Visit can cover multiple class
    occurrences (same day). Use earliest start → latest end across
    linked occurrences to compute visit duration.
  - `servicesCounted` defaults to 1. Business logic should enforce an upper
    bound based on the visit duration: services = ceil((end - start) / 2.5h).
  - `createdBy` / `confirmedBy` are metadata (who requested / confirmed).

Notes and implementation guidance

- Recurrences & exceptions: store templates as `ClassTime` + `rrule` and
  treat `ClassTimeException` as per-occurrence overrides. When a director
  edits "this and future" occurrences, consider splitting the template
  and creating appropriate exceptions (same approach as calendar systems).
- Service accounting: keep `servicesAllocated` (School) and
  `MentorSchool.allotments` as the source of truth. Decrementing or
  calculating used services can be derived from confirmed `Visit` records
  (sum of `servicesCounted`) or tracked in a materialized counter if needed.
- Time zones: persist timestamps in UTC and use `School.timezone` when
  converting to/from local times for display and recurrence expansion.

## Quickstart (local using Docker)

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

- After `npm install` you can run `npm run dev` locally without Docker for faster iteration.
