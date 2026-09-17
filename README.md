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
- Settings and demo-data reset
- Login screen
- PostgreSQL + Prisma production data model
- Mobile responsive UI
- INR / India-friendly formatting

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

The UI currently uses browser localStorage for a zero-setup demo. The Prisma schema is included for the production database layer.

## Production layer still to connect
- Server-side authentication/session handling
- Password hashing and account registration
- Protected API routes / server actions
- PostgreSQL persistence
- User ownership/authorization checks
- Recurring-expense scheduler
- Email/push notifications
- Export CSV/PDF
- Optional AI assistant
- Automated tests and deployment environment variables

Do not use the demo localStorage auth/data as a production security mechanism.
