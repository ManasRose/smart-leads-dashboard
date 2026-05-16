# 🚀 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and Tailwind CSS.

---

## 🌐 Live Demo

| Service         | URL                                                 |
| --------------- | --------------------------------------------------- |
| **Frontend**    | https://smart-leads-dashboard-1-l006.onrender.com   |
| **Backend API** | https://smart-leads-dashboard-uryz.onrender.com/api |

> ⚠️ Hosted on Render's free tier — the backend may take 20-30 seconds to wake up on first request after inactivity.

---

## 📦 Tech Stack

| Layer     | Technology                               |
| --------- | ---------------------------------------- |
| Frontend  | React 18, TypeScript, Tailwind CSS, Vite |
| Backend   | Node.js, Express.js, TypeScript          |
| Database  | MongoDB Atlas + Mongoose                 |
| Auth      | JWT + bcryptjs                           |
| State     | TanStack React Query                     |
| Forms     | React Hook Form                          |
| Container | Docker + Docker Compose                  |

---

## ✨ Features

- **JWT Authentication** — Register, login, protected routes, auth middleware
- **Lead CRUD** — Create, read, update, delete leads
- **Advanced Filtering** — Filter by status, source, search by name/email, sort (latest/oldest)
- **Backend Pagination** — 10 records per page with metadata
- **Debounced Search** — 400ms debounce to reduce API calls
- **CSV Export** — Download filtered leads as CSV
- **Role-Based Access Control** — Admin sees all leads; Sales sees only their own
- **Dark Mode** — System preference + manual toggle
- **Responsive UI** — Mobile-first design with grid and table views
- **Loading & Error States** — Proper UX for async operations
- **Form Validation** — Client-side (React Hook Form) + server-side (express-validator)

---

## 📁 Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error, validation middleware
│   │   ├── models/         # Mongoose models (User, Lead)
│   │   ├── routes/         # Express routers
│   │   ├── types/          # TypeScript interfaces & enums
│   │   ├── utils/          # JWT helpers, API response helpers
│   │   ├── validators/     # express-validator rule sets
│   │   ├── app.ts          # Express app configuration
│   │   └── server.ts       # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance + API modules
│   │   ├── components/
│   │   │   ├── auth/       # LoginForm, RegisterForm, ProtectedRoute
│   │   │   ├── dashboard/  # Navbar, StatsBar
│   │   │   ├── leads/      # LeadCard, LeadTable, LeadForm, LeadFilters, LeadDetailModal
│   │   │   └── ui/         # Button, Input, Select, Modal, Badge, Pagination, etc.
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── hooks/          # useLeads (React Query), useDebounce
│   │   ├── pages/          # AuthPage, DashboardPage, NotFoundPage
│   │   ├── types/          # TypeScript interfaces & enums
│   │   ├── utils/          # Color maps, date formatting, CSV download
│   │   ├── main.tsx        # App entry point
│   │   └── index.css       # Tailwind base styles
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local) or MongoDB Atlas (cloud)
- Docker & Docker Compose (optional)

---

### Option 1: Local Development

#### 1. Clone the repository

```bash
git clone https://github.com/ManasRose/smart-leads-dashboard
cd smart-leads-dashboard
```

#### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

The API will be available at `http://localhost:5000`

#### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

---

### Option 2: Docker (Production)

```bash
# Copy and fill environment variables
cp backend/.env.example backend/.env

# Build and start all services
docker compose up --build

# App available at http://localhost
```

### Option 3: Docker (Development with hot-reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

---

## 🌍 Environment Variables

### Backend `.env`

| Variable          | Description                        | Example                           |
| ----------------- | ---------------------------------- | --------------------------------- |
| `PORT`            | Server port                        | `5000`                            |
| `NODE_ENV`        | Environment                        | `development`                     |
| `MONGODB_URI`     | MongoDB connection string          | `mongodb://localhost:27017/leads` |
| `JWT_SECRET`      | JWT signing secret (keep private!) | `your_secret_key`                 |
| `JWT_EXPIRES_IN`  | Token expiry                       | `7d`                              |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-sep)   | `http://localhost:3000`           |

### Frontend `.env`

| Variable            | Description     | Example                     |
| ------------------- | --------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 👤 User Roles

| Role  | Capabilities                                    |
| ----- | ----------------------------------------------- |
| Admin | Full CRUD on all leads, export all leads as CSV |
| Sales | CRUD only on own leads, export own leads as CSV |

---

## 📊 Lead Fields

| Field     | Type   | Values                          |
| --------- | ------ | ------------------------------- |
| name      | string | Min 2, Max 100 chars            |
| email     | string | Valid email format              |
| status    | enum   | New, Contacted, Qualified, Lost |
| source    | enum   | Website, Instagram, Referral    |
| notes     | string | Optional, max 500 chars         |
| createdBy | ref    | Reference to User               |
| createdAt | date   | Auto-generated                  |

---

## 🔐 API Overview

See [API_DOCS.md](./API_DOCS.md) for full documentation.

Base URL: `https://smart-leads-dashboard-uryz.onrender.com/api`

| Method | Endpoint       | Auth | Description                  |
| ------ | -------------- | ---- | ---------------------------- |
| POST   | /auth/register | No   | Register new user            |
| POST   | /auth/login    | No   | Login & get JWT token        |
| GET    | /auth/me       | Yes  | Get current user info        |
| GET    | /leads         | Yes  | Get leads (filter/sort/page) |
| POST   | /leads         | Yes  | Create new lead              |
| GET    | /leads/:id     | Yes  | Get single lead              |
| PUT    | /leads/:id     | Yes  | Update lead                  |
| DELETE | /leads/:id     | Yes  | Delete lead                  |
| GET    | /leads/export  | Yes  | Export leads as CSV          |

---

## 📝 Git Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add CSV export functionality
fix: handle 401 token expiry correctly
chore: update dependencies
refactor: extract pagination into reusable hook
```

---

## 🧪 Running Linting

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

---

## 📬 Submission

Send to: **ritik.yadav@servicehive.tech**  
Subject: `MERN Internship Assignment Submission - Manas Rose`
