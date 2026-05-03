# Nexus FYP Management System — Backend

A production-ready REST API for the FAST NUCES Final Year Project (FYP) Management Platform, built with **Hexagonal Architecture (Ports & Adapters)**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB via Mongoose |
| Auth | JWT + bcrypt |
| File Upload | Multer |
| Validation | express-validator |
| Architecture | Hexagonal (Ports & Adapters) |

---

## Folder Structure

```
src/
├── domain/               # Core business logic — zero framework dependencies
│   ├── entities/         # User, Proposal, Milestone, Submission, Feedback, Panel, Announcement
│   └── rules/            # eligibility.js — business invariant checks
│
├── application/          # Use cases (orchestrate domain + ports)
│   ├── auth/             # auth.usecase.js
│   ├── student/          # proposal, milestone, feedback, profile use cases
│   └── admin/            # userManagement, proposalManagement, panel, announcement, stats use cases
│
├── ports/                # Abstract interfaces (contracts)
│   └── repositories/     # IUserRepository, IProposalRepository, … (7 total)
│
├── adapters/             # Concrete implementations
│   ├── db/
│   │   ├── models/       # Mongoose schemas (UserModel, ProposalModel, …)
│   │   └── repositories/ # MongoUserRepository, MongoProposalRepository, …
│   └── http/
│       ├── routes/       # auth, student, admin, supervisor (stub), jury (stub)
│       ├── controllers/  # AuthController, StudentController, AdminController
│       └── middlewares/  # auth, role, validation, upload
│
├── config/               # db.js — MongoDB connection
├── app.js                # Express configuration
└── server.js             # Entry point
```

---

## Setup Instructions

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — a strong random string
- `CLIENT_URL` — frontend URL (default: `http://localhost:5173`)

### 3. Start development server

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

---

## API Endpoint Summary

### Auth — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login — returns JWT |
| GET  | `/api/auth/me` | Get current user profile |

### Student — `/api/student` (role: `student`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/student/proposals` | Submit new proposal |
| GET  | `/api/student/proposals/me` | View own proposal |
| GET  | `/api/student/milestones` | View all milestones |
| POST | `/api/student/milestones/:id/submit` | Upload deliverable (multipart/form-data) |
| GET  | `/api/student/submissions/me` | View own submissions |
| GET  | `/api/student/feedback/me` | View feedback on submissions |
| GET  | `/api/student/profile` | View profile |
| PUT  | `/api/student/profile` | Update profile |

### Admin — `/api/admin` (role: `admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/admin/stats` | Dashboard counts |
| GET    | `/api/admin/users` | List users (filter by `?role=student`) |
| PATCH  | `/api/admin/users/:id/approve` | Approve user |
| PATCH  | `/api/admin/users/:id/reject` | Reject user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET    | `/api/admin/proposals` | List proposals (filter by `?status=pending`) |
| PATCH  | `/api/admin/proposals/:id/approve` | Approve proposal |
| PATCH  | `/api/admin/proposals/:id/reject` | Reject proposal |
| POST   | `/api/admin/panels` | Create defense panel |
| GET    | `/api/admin/panels` | List all panels |
| PUT    | `/api/admin/panels/:id` | Update panel |
| DELETE | `/api/admin/panels/:id` | Delete panel |
| POST   | `/api/admin/announcements` | Post announcement |
| GET    | `/api/admin/announcements` | List announcements |
| PATCH  | `/api/admin/announcements/:id/pin` | Toggle pin |
| DELETE | `/api/admin/announcements/:id` | Delete announcement |

### Extension Points (for Partner)

- **Supervisor**: `src/adapters/http/routes/supervisor.routes.js` — well-documented TODO comments
- **Jury**: `src/adapters/http/routes/jury.routes.js` — well-documented TODO comments
- Models (`MilestoneModel`, `FeedbackModel`, `SubmissionModel`) and repositories are all implemented.

---

## Authentication

All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

JWT is returned from `/api/auth/login` and `/api/auth/register`.

---

## Response Format

All responses follow this structure:

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Reason for failure." }
```

---

## File Uploads

Submit deliverables via `POST /api/student/milestones/:id/submit` with:
- Content-Type: `multipart/form-data`
- Field name: `file`
- Accepted formats: `.pdf`, `.zip`, `.mp4`
- Max size: 50 MB

Files are stored in `/uploads/` and accessible at `http://localhost:5000/uploads/<filename>`.
