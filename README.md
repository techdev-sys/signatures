# Signatures

Signatures is a multi-app ordering and delivery platform. Customers place orders, branch staff manage fulfilment, and drivers receive and complete delivery requests. Supabase stores the shared data, while the Express API owns business rules and protects privileged credentials.

## Active projects

| Project | Location | Purpose |
| --- | --- | --- |
| Backend API | `backend/` | Express, TypeScript, Supabase, and business logic |
| Branch Dashboard | `apps/branch_dashboard/` | Branch order and delivery operations |
| Driver App | `apps/driver_app/` | Driver delivery workflow |
| Customer App | `apps/customer_app/customer-mobile/` | Customer ordering experience |

Other folders currently contain concepts, reference implementations, documentation, or experiments. Before the first shared commit, the team should agree which of those folders belong in the product repository.

## Current architecture

```text
Customer App --------\
Branch Dashboard -----> Express API ---> Supabase
Driver App ----------/
```

Frontend applications must call the Express API for business operations. Never put `SUPABASE_SECRET_KEY` or the legacy service-role key in a browser or mobile application.

## Local setup

Requirements:

- Node.js and npm
- Expo Go or an Android/iOS emulator for the mobile apps
- Access to the team's Supabase project

### Backend

```powershell
cd C:\Users\hp\Desktop\Signatures\backend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Fill in `backend/.env` locally. Do not commit it.

The API runs at `http://localhost:4000` and its health check is available at `http://localhost:4000/api/health`.

### Branch Dashboard

```powershell
cd C:\Users\hp\Desktop\Signatures\apps\branch_dashboard
npm.cmd install
npm.cmd run dev
```

### Driver App

```powershell
cd C:\Users\hp\Desktop\Signatures\apps\driver_app
npm.cmd install
npm.cmd start
```

### Customer App

```powershell
cd C:\Users\hp\Desktop\Signatures\apps\customer_app\customer-mobile
npm.cmd install
npm.cmd start
```

## Team workflow

Use `main` as the stable integration branch. Do not create permanent “logic” and “UI” branches; they drift apart and make integration harder. Use a short-lived branch for each feature instead.

Examples:

```text
feat/delivery-acceptance-api
feat/driver-delivery-card
fix/order-status-error
design/checkout-polish
```

Start each task from an updated `main`:

```powershell
git switch main
git pull
git switch -c feat/short-description
```

Before opening a pull request:

```powershell
git status
npm.cmd run build
git add <changed-files>
git commit -m "feat: describe the change"
git push -u origin feat/short-description
```

Use pull requests even with two people. The person who did not write the change reviews it before merging.

### Suggested ownership

The logic developer primarily owns:

- Database design and migrations
- Express services, controllers, and routes
- API types and validation
- App state, data fetching, and error handling
- Integration and automated tests

The UI/UX developer primarily owns:

- Screens, components, layouts, and responsive behavior
- Design tokens, typography, colors, spacing, and icons
- Loading, empty, error, and interaction states
- Accessibility and usability
- Design assets and prototypes

Ownership is a coordination tool, not a wall. Both developers should review shared contracts and integration code.

### Work contract-first

Before either person starts a feature, agree on:

1. The user flow and acceptance criteria.
2. The API request and response shape.
3. Loading, empty, success, and error states.
4. Which files each person expects to edit.

For example, a delivery card can be built against an agreed `Delivery` TypeScript type while the endpoint is being implemented. When the API is ready, the UI should only need its data adapter replaced—not a redesign.

### Avoid merge conflicts

- Tell each other which files you are editing before starting.
- Keep pull requests small and focused on one feature.
- Pull or rebase from `main` before handing work over.
- Avoid drive-by formatting of files owned by the other task.
- Commit lockfile changes only when dependencies intentionally change.
- Never commit `.env`, secret keys, generated builds, or `node_modules`.

## Definition of done

A feature is complete when:

- The real API/database path works, not only mock data.
- Loading, empty, success, and failure states are handled.
- Relevant build, lint, and tests pass.
- No secrets or generated files are staged.
- Another teammate reviews the pull request.
- The README or API documentation is updated when setup or contracts change.

## Current API endpoints

```text
GET   /api/health
GET   /api/branches
POST  /api/auth/sign-up
POST  /api/auth/sign-in
POST  /api/auth/refresh
GET   /api/auth/me
POST  /api/auth/sign-out
POST  /api/orders
GET   /api/orders/mine
GET   /api/orders/branch/:branchCode
GET   /api/orders/:orderNumber/tracking
PATCH /api/orders/:orderNumber/status
POST  /api/deliveries/request
GET   /api/deliveries/available/:driverCode
GET   /api/deliveries/driver/:driverCode/active
GET   /api/deliveries/driver/:driverCode/completed
POST  /api/deliveries/:deliveryId/accept
PATCH /api/deliveries/:deliveryId/status
```

