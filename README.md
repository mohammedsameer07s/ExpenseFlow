# ExpenseFlow 2.0

Full-featured ExpenseFlow portfolio project foundation.

## Included
- Premium responsive dashboard
- Income / expense / transfer records
- Add, search and delete transactions
- Categories and payment methods
- Budget creation and progress tracking
- Savings goals and progress
- Reports with charts and category analysis
- Rule-based financial insight cards
- Settings and local data reset
- Login screen
- PostgreSQL + Prisma production data model
- Mobile responsive UI
- INR / India-friendly formatting

## Run locally
```bash
npm install
npx prisma migrate dev --name init
npm run dev
```
Open http://localhost:3000.

Create `.env.local` from `.env.example` and set a real PostgreSQL `DATABASE_URL` before running migrations. Authentication uses salted password hashes and HTTP-only database-backed sessions. Finance data is stored per user through the Prisma API.

## QA checklist
- TC-001: User can register successfully.
- TC-002: User can login with valid credentials.
- TC-003: Invalid password is rejected.
- TC-004: Expense can be added.
- TC-005: Expense amount cannot be negative.
- TC-006: User cannot access another user's records.
- TC-007: Budget calculation is accurate.
- TC-008: Transaction deletion removes the record.
- TC-009: Mobile layout remains usable on narrow screens.

## Still to build
- Recurring-expense scheduler
- Email/push notifications
- Export CSV/PDF
- Optional AI assistant
- Automated tests and deployment environment variables

Do not use the demo localStorage auth/data as a production security mechanism.
