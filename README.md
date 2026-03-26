# Healthcare System Monorepo (Express.js + MongoDB)

## Services

- `patient-service` (auth, profile, upload docs, history, prescriptions)
- `doctor-service` (auth, profile, availability, accept/reject appointments, prescriptions)
- `appointment-service` (search doctors, book/update/cancel, status tracking via SSE)
- `telemedicine-service` (session token generation + secure session endpoints)
- `payment-service` (mock PayHere/Stripe, status tracking, webhook handler)
- `notification-service` (email via nodemailer, SMS mock)
- `gateway` (routes + basic JWT authentication middleware)
- `shared` (logger + consistent response/error handling)

## Run with Docker Compose

1. Start:
   - `docker compose up --build`
2. Gateway:
   - `http://localhost:3000/`

### Configure environment

Copy `/.env.example` to `/.env` (at repo root). `docker-compose.yml` reads it automatically.

### Default secrets

If you don't set your own values in `/.env`, these defaults are used:
- `JWT_SECRET=dev_change_me`
- `INTERNAL_SERVICE_TOKEN=internal_dev_change_me`

Override them by setting environment variables before running compose.

## Quick Test (Patient)

1. Register a patient (also creates an admin on startup if `ADMIN_EMAIL`/`ADMIN_PASSWORD` are set):
   - `POST http://localhost:3000/api/patients/auth/register`
2. Login:
   - `POST http://localhost:3000/api/patients/auth/login`
3. Use `Authorization: Bearer <token>` for protected endpoints.

Example (login):
```bash
curl -s -X POST http://localhost:3000/api/patients/auth/login ^
  -H "content-type: application/json" ^
  -d "{\"email\":\"patient@test.com\",\"password\":\"password12345\"}"
```

## Notes

- File uploads are implemented with `multer` storing locally in the container. Replace the storage layer with S3/Cloud storage later.
- Each service uses its own database name on the same MongoDB instance (`patient_db`, `doctor_db`, etc).

