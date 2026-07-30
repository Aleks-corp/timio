# timio

meeting room scheduler

## Database (backend)

```bash
cd backend
npm run prisma:migrate   # apply schema migrations (creates tables)
npm run prisma:seed      # reset & seed rooms, users, demo bookings
```

Test accounts (seeded, password for both: `Password123`):

| name          | email           |
| ------------- | --------------- |
| Олена Коваль  | elena@timio.dev |
| Ivan Petrenko | ivan@timio.dev  |

## Auth

Session is a JWT stored in an httpOnly cookie (`token`). Required env vars (see `backend/.env.example`):

- `JWT_SECRET` — required, signs the session token.
- `COOKIE_DOMAIN` — optional, scopes the cookie to a domain in production.

Endpoints (`/auth`):

- `POST /signup` — `{ name, email, password }` → `201 { user }`, sets session cookie.
- `POST /signin` — `{ email, password }` → `200 { user }`, sets session cookie.
- `POST /oauth-upsert` — `{ provider, providerId, email, name, avatar? }` → `200 { user }`, sets session cookie. Finds a user by `(provider, providerId)`, falls back to matching by `email` to link an OAuth identity to an existing account, otherwise creates a new (passwordless) user.
- `POST /signout` — `204`, clears session cookie.
- `GET /current` — requires session cookie → `200 { user }`.

## Rooms & bookings

All times are stored in UTC (`timestamptz`); office hours (09:00–19:00) are checked in `Europe/Kyiv`, DST-safe, via `Intl.DateTimeFormat` (see `src/utils/timezone.utils.ts`). `GET /rooms/*` are public — the schedule is visible to everyone per spec. Booking mutations require the auth cookie.

Endpoints:

- `GET /rooms?minCapacity=` — `200 { rooms }`.
- `GET /rooms/:id/bookings?weekStart=YYYY-MM-DD` — week view (Monday–Sunday, office time), defaults to the current week → `200 { weekStart, weekEnd, bookings }`, each booking includes `user.name`.
- `GET /rooms/availability?roomId=&startAt=&endAt=` — pre-flight check reusing the same validation as booking creation → `200 { available, reason? }` (never throws for a business-rule violation, only for a malformed request or unknown room).
- `POST /bookings` — `{ roomId, title, startAt, endAt }`, auth required → `201 { booking }`.
- `DELETE /bookings/:id` — auth required, owner only → `204` / `403` / `404`.
- `GET /bookings/me?section=upcoming|past&limit=&offset=` — auth required → `200 { bookings }` (`upcoming` soonest-first, `past` most-recent-first).

**Overlap rule**: `newStart < existingEnd && existingStart < newEnd`, applied as a Prisma `where` filter (`startAt: { lt: endAt }, endAt: { gt: startAt }`) — back-to-back bookings (end == start) don't conflict. Pure validation logic (`intervalsOverlap`, `isAlignedToSlot`, `isWithinOfficeHours`, `getBookingWindowError`) lives in `src/utils/booking.utils.ts`, decoupled from Express/Prisma, and is unit-tested with Node's built-in test runner: `npm test`.

**Race condition**: `POST /bookings` runs the overlap check and the insert inside one Prisma transaction that first takes a Postgres advisory lock keyed by `roomId` (`pg_advisory_xact_lock(hashtext(roomId))`). Concurrent requests for the *same* room are serialized by Postgres itself; requests for different rooms don't block each other. The lock is transaction-scoped and released automatically on commit/rollback — no manual unlock, no risk of a stuck lock. Verified manually: 8 concurrent requests for one slot → exactly one `201`, the rest `409`.
