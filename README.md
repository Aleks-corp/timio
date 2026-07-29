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
