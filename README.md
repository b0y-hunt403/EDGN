# EDGN — Ethiopian Digital Guarantee Network

Interactive presentation demo of the **Ethiopian Digital Guarantee Network (EDGN)** — a multi-bank, multi-organization digital infrastructure for the complete bank-guarantee lifecycle.

> **Note:** This is a frontend demonstration with mock data. It is not connected to a production backend.

---

## Tech Stack

| Layer       | Technology                        |
| ----------- | --------------------------------- |
| Framework   | Next.js 16 (App Router)           |
| UI          | React 19                          |
| Language    | TypeScript (strict)               |
| Styling     | Tailwind CSS v4                   |
| Icons       | lucide-react                      |
| Charts      | recharts                          |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18+**
- [npm](https://www.npmjs.com/) (or yarn / pnpm)

### Install

```bash
git clone https://github.com/b0y-hunt403/EDGN.git
cd EDGN
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `npm run build`      | Production build                |
| `npm start`          | Start production server         |
| `npm run typecheck`  | TypeScript type-check (no emit) |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           #   Authentication pages (login, signup, etc.)
│   ├── verify/           #   Public guarantee verification
│   ├── help/             #   Demo help & guidance
│   └── [portal]/         #   Catch-all portal route
│
├── components/           # Shared UI components
│   ├── auth/             #   Auth guard & role guard
│   ├── layout/           #   AppShell, Sidebar, Topbar, Brand, RoleSwitcher
│   ├── ui/               #   Button, Card, Modal, Form controls, Badge, Tabs
│   └── shared/           #   Charts, DataTable, States, Toasts, etc.
│
├── config/               # Navigation & role-home mappings
├── features/             # Feature modules per portal
│   ├── applicant/        #   Applicant portal
│   ├── beneficiary/      #   Beneficiary portal
│   ├── bank/             #   Bank portal (Maker / Checker / Signatory)
│   ├── admin/            #   EDGN Administration portal
│   ├── court/            #   Court Officer portal
│   ├── developer/        #   API Developer portal
│   ├── verification/     #   Public guarantee verification
│   ├── auth/             #   Login, Signup, Forgot Password, Unauthorized
│   ├── guarantees/       #   Shared guarantee list & detail views
│   └── common/           #   Shared pages (Profile, Security, Claims, etc.)
│
├── mocks/                # Mock data (applications, guarantees, users, etc.)
├── services/             # Mock API service layer
├── store/                # React Context stores (DemoStore, AuthStore)
├── types/                # TypeScript type definitions
└── lib/                  # Utilities, formatters, i18n, mock-api helpers
```

---

## Authentication

The app uses a **mock authentication layer** for presentation purposes.

### Demo Accounts

Click **Demo Accounts** on the login page to auto-fill credentials.

| Role               | Email                           |
| ------------------ | ------------------------------- |
| Applicant          | `demo.applicant@edgn.gov.et`   |
| Beneficiary        | `demo.beneficiary@edgn.gov.et` |
| Bank Maker         | `demo.maker@bank.edgn.gov.et`  |
| Bank Checker       | `demo.checker@bank.edgn.gov.et`|
| Bank Signatory     | `demo.signatory@bank.edgn.gov.et`|
| EDGN Administrator | `demo.admin@edgn.gov.et`       |
| Court Officer      | `demo.court@edgn.gov.et`       |
| API Developer      | `demo.developer@edgn.gov.et`   |

**Password for all demo accounts:** `Demo@123`

### Routes

| Route              | Description                          |
| ------------------ | ------------------------------------ |
| `/login`           | Sign in                              |
| `/signup`          | Multi-step registration              |
| `/forgot-password` | Password reset request               |
| `/unauthorized`    | Access denied                        |
| `/verify`          | Public guarantee verification        |

After login, users are redirected to their role-specific dashboard (e.g. `/applicant`, `/bank/work-queue`, `/admin`).

### Quick Role Switching

Once logged in, use the **Role Switcher** in the top-right corner to instantly switch between demo perspectives without logging out.

---

## Portals

| Portal       | URL prefix   | Description                                   |
| ------------ | ------------ | --------------------------------------------- |
| Applicant    | `/applicant` | Request and manage guarantees                 |
| Beneficiary  | `/beneficiary`| Receive, verify, and claim guarantees        |
| Bank         | `/bank`      | Process, approve, and issue guarantees        |
| Admin        | `/admin`     | Platform configuration and management         |
| Court        | `/court`     | Judicial case management                      |
| Developer    | `/developer` | API integration and sandbox                   |

---

## Connected Demo Workflow

The mock data supports an end-to-end presentation workflow:

```
1. Login as Applicant
   → Create Guarantee Application
   → Submit Application

2. Switch to Bank Maker
   → Application appears in Work Queue
   → Review and forward to Checker

3. Switch to Bank Checker
   → Approve Application

4. Switch to Bank Signatory
   → Sign and Issue Guarantee

5. Switch to Beneficiary
   → View Issued Guarantee
   → Verify via Public Verification
```

Workflow state persists across page refreshes via `localStorage`.

---

## Mock Data

All data is mock and stored in `src/mocks/`. The following are persisted to `localStorage` during the session:

- Application workflow state (`edgn-demo-workflow-v1`)
- Selected role (`edgn-demo-role-v1`)
- Auth session (`edgn-auth-session-v1`)
- Language preference (`edgn-demo-language-v1`)

Use the **Reset connected demo workflow** button (in the Role Switcher) to restore original data.

---

## Production Boundary

> **This is a frontend demonstration only.**
>
> The mock authentication, role-based access, and all data are client-side. A production implementation must replace:
> - Mock authentication → real identity provider
> - Client-side route guards → server-side authorization
> - Mock data → real API endpoints

---

## License

Proprietary — EDGN Authority. All rights reserved.
