# timio
meeting room scheduler

## Database (backend)

```bash
cd backend
npm run prisma:migrate   # apply schema migrations (creates tables)
npm run prisma:seed      # reset & seed rooms, users, demo bookings
```

Test accounts (seeded, password for both: `Password123`):

| name           | email             |
| -------------- | ----------------- |
| Олена Коваль   | elena@timio.dev   |
| Ivan Petrenko  | ivan@timio.dev    |
