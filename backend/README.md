# Nexus FYP — Backend API

Backend API for the **FAST NUCES FYP Management System**. This module handles the **Supervisor** and **Jury/Panel** roles. The Student and Admin/Coordinator modules are designed as extension points for a partner to integrate seamlessly.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Auth | JWT + bcrypt + RBAC |
| Validation | Joi |
| File Upload | Multer (local disk) |
| Architecture | Hexagonal (Ports & Adapters) |

## Architecture — Hexagonal (Ports & Adapters)

```
src/
├── domain/                   # Pure business logic — ZERO framework dependencies
│   ├── entities/             # User, Proposal, Milestone, Submission, Feedback, Panel, Announcement
│   └── rules/                # gradingRules.js, eligibilityRules.js
├── application/              # Use cases (orchestration layer)
│   ├── auth/                 # register, login, getMe
│   ├── supervisor/           # 12 use cases (requests, milestones, submissions, feedback, profile)
│   └── jury/                 # 8 use cases (panels, submissions, grading, profile)
├── ports/                    # Abstract interfaces (contracts)
│   ├── repositories/         # IUserRepository, IProposalRepository, etc.
│   └── services/             # IEmailService (stub for future)
├── adapters/                 # Concrete implementations
│   ├── db/
│   │   ├── models/           # Mongoose schemas
│   │   └── repositories/     # MongoXxxRepository implementations
│   └── http/
│       ├── routes/           # Express route definitions
│       ├── controllers/      # Thin controllers (delegate to use cases)
│       ├── middlewares/      # auth, role, validation, upload, error
│       └── validators/       # Joi schemas
├── config/                   # db.js, env.js
├── utils/                    # AppError.js, logger.js
├── app.js                    # Express app setup
└── server.js                 # Entry point
```

**Key principle:** Business logic lives ONLY in `domain/` and `application/`. Controllers are thin — they extract request data and call use cases.

## Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster (or local MongoDB)

### Installation

```bash
cd backend
npm install
```

### Configuration

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nexus-fyp
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
```

### Run

```bash
npm run dev      # Development (nodemon, auto-restart)
npm start        # Production
```

The server will log:
```
[INFO] MongoDB connected successfully
[INFO] Server running on port 5000
```

## API Endpoints

### Auth (all roles)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register (pending admin approval) |
| POST | `/api/auth/login` | Public | Login → JWT |
| GET | `/api/auth/me` | Token | Current user profile |

### Supervisor

| Method | Path | Description |
|---|---|---|
| GET | `/api/supervisor/requests` | View incoming supervision requests |
| PATCH | `/api/supervisor/requests/:proposalId/accept` | Accept a request |
| PATCH | `/api/supervisor/requests/:proposalId/reject` | Reject a request |
| POST | `/api/supervisor/milestones` | Create milestone |
| GET | `/api/supervisor/milestones` | List own milestones |
| PUT | `/api/supervisor/milestones/:id` | Update milestone |
| DELETE | `/api/supervisor/milestones/:id` | Delete milestone |
| GET | `/api/supervisor/submissions` | View submissions from supervised students |
| GET | `/api/supervisor/submissions/:id` | View specific submission |
| POST | `/api/supervisor/submissions/:submissionId/feedback` | Submit feedback + grade |
| GET | `/api/supervisor/submissions/:submissionId/feedback` | View feedback on submission |
| GET | `/api/supervisor/profile` | View own profile |
| PUT | `/api/supervisor/profile` | Update profile |

### Jury

| Method | Path | Description |
|---|---|---|
| GET | `/api/jury/panels/me` | View assigned panels |
| GET | `/api/jury/panels/:panelId/groups` | View groups in panel |
| GET | `/api/jury/submissions/:groupId` | View group submissions |
| GET | `/api/jury/submissions/:submissionId/file` | Access submission file |
| POST | `/api/jury/submissions/:submissionId/grade` | Submit grade + feedback |
| GET | `/api/jury/submissions/:submissionId/grade` | View own grade |
| GET | `/api/jury/profile` | View own profile |
| PUT | `/api/jury/profile` | Update profile |

## Response Format

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Error description" }
```

## Extension Guide (for Partner)

Your partner needs to add **Student** and **Admin/Coordinator** modules. Here's how:

1. **Use cases:** Create `src/application/student/` and `src/application/admin/` directories
2. **Controllers:** Add `StudentController.js` and `AdminController.js` in `src/adapters/http/controllers/`
3. **Routes:** Add `student.routes.js` and `admin.routes.js` in `src/adapters/http/routes/`
4. **Register routes:** Uncomment the TODO section in `src/adapters/http/routes/index.js`
5. **Validators:** Add `student.validator.js` and `admin.validator.js` in `src/adapters/http/validators/`

All shared infrastructure is ready: models, repositories, auth middleware, role guards, error handling, and file upload.

## File Upload

- Files stored in `./uploads/` (auto-created)
- Max size: 50 MB
- Allowed types: PDF, ZIP
- Accessible via: `http://localhost:5000/uploads/<filename>`
