# Nexus — Smart FYP Management System

> A full-stack MERN platform that digitizes the Final Year Project lifecycle at FAST NUCES.

---

## Project Overview

Nexus centralizes and streamlines every phase of the FYP process — from proposal submission and approval to milestone tracking, file delivery, supervisor evaluation, and final jury defense scoring.

---

## Features

| Module | Features |
|---|---|
| **Student** | Submit proposals with team details & GitHub link, track approval status, upload milestone deliverables (PDF/ZIP), view supervisor feedback & grades |
| **Supervisor** | Accept/reject supervision requests, create phase-based milestones with deadlines, grade submissions via digital rubric, leave comments |
| **Admin/Coordinator** | Approve/reject user registrations, manage jury defense panels, post targeted announcements, view dashboard stats |
| **Jury** | View assigned defense panels and groups, access submitted documents & GitHub repositories, enter multi-criteria defense scores |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Routing | React Router v7 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas via Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Uploads | Multer |
| Validation | express-validator |
| Architecture | Hexagonal Architecture (Ports & Adapters) |

---

## Architecture

The backend follows **Hexagonal Architecture**:

```
src/
├── domain/          # Pure JS entities + business rules (no framework dependencies)
│   ├── entities/    # User, Proposal, Milestone, Submission, Feedback, Panel, Announcement
│   └── rules/       # eligibility.js, gradingRules.js
├── ports/           # Repository interfaces (IUserRepository, IProposalRepository, ...)
├── application/     # Use cases per role (auth, student, admin, supervisor, jury)
└── adapters/
    ├── db/          # Mongoose models + MongoRepository implementations
    └── http/        # Express controllers, routes, middlewares, validators
```

---

## Setup & Installation

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in MONGO_URI and JWT_SECRET
npm run dev            # Starts on http://localhost:5000
```

**Required `.env` variables:**
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
# Optional: create .env with VITE_API_URL=http://localhost:5000/api
npm run dev            # Starts on http://localhost:5173
```

### Seed Test Data

```bash
cd backend
node scripts/seed_all.js
```

---

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@nu.edu.pk | password123 |
| Student | student@nu.edu.pk | password123 |
| Supervisor | supervisor@nu.edu.pk | password123 |
| Jury | jury@nu.edu.pk | password123 |
| Jury 2 | jury2@nu.edu.pk | password123 |
| Jury 3 | jury3@nu.edu.pk | password123 |

---

## API Endpoints

| Method | Path | Role | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login and receive JWT |
| GET | /api/auth/me | Any | Get current user profile |
| GET | /api/student/proposals/me | Student | Get own proposal |
| POST | /api/student/proposals | Student | Submit a proposal |
| GET | /api/student/milestones | Student | List milestones |
| POST | /api/student/milestones/:id/submit | Student | Upload deliverable |
| GET | /api/admin/users | Admin | List users |
| PATCH | /api/admin/users/:id/approve | Admin | Approve user |
| GET | /api/admin/proposals | Admin | List proposals |
| PATCH | /api/admin/proposals/:id/approve | Admin | Approve proposal |
| POST | /api/admin/panels | Admin | Create jury panel |
| GET | /api/supervisor/requests | Supervisor | Get supervision requests |
| POST | /api/supervisor/milestones | Supervisor | Create milestone |
| POST | /api/supervisor/submissions/:id/feedback | Supervisor | Submit grade + feedback |
| GET | /api/jury/panels/me | Jury | Get assigned panels |
| POST | /api/jury/submissions/:id/grade | Jury | Submit defense score |

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MongoDB Atlas |

Set `VITE_API_URL` in the frontend environment to point to your deployed backend URL.

---

## Team

| Member | Role |
|---|---|
| [Ahsan Naeem] | Student Module + Admin/Coordinator Module |
| [Partner Name] | Supervisor Module + Jury Module |

---

## Project Status

✅ Authentication & Authorization  
✅ Student Module (Proposals, Milestones, Submissions, Feedback)  
✅ Admin Module (Users, Panels, Announcements, Stats)  
✅ Supervisor Module (Requests, Milestones, Grading)  
✅ Jury Module (Panels, Deliverables, Scoring)  
⬜ Production Deployment  

cd backend
node scripts/fresh_reset.js
node scripts/seed_all.js