# Smart FYP Backend Architecture & Frontend Integration

This document outlines the complete backend structure and the integration with your React frontend.

## 🏗️ Hexagonal Architecture (Ports & Adapters)

The backend has been strictly structured into layers to separate concerns, making it highly modular and easy for your partner to extend later.

### 1. Domain Layer (`src/domain`)
- **Entities**: Pure JS classes (e.g., `Proposal.js`, `Milestone.js`) defining core business data.
- **Rules**: `eligibility.js` contains invariant checks (e.g., `canStudentSubmitProposal`) completely devoid of framework logic.

### 2. Application Layer (`src/application`)
- Contains **Use Cases** for the Student and Admin (Coordinator) roles.
- Examples: `submitProposal`, `uploadDeliverable`, `approveUser`, `createPanel`.
- Orchestrates logic using domain entities and repository ports.

### 3. Ports (`src/ports`)
- Interfaces detailing how data should be handled (e.g., `IUserRepository`, `IProposalRepository`). 
- This ensures the application layer does not depend directly on Mongoose.

### 4. Adapters (`src/adapters`)
- **DB Layer**: Mongoose schemas and Repository implementations (e.g., `MongoUserRepository.js`).
- **HTTP Layer**: Express Controllers, Routes, and Middlewares (`auth`, `role`, `validation`, `upload`).

## 🚀 Features Implemented

### **Student Module**
- Submit FYP Proposals.
- View assigned Milestones.
- Upload project Deliverables (PDF, ZIP, MP4) with deadline enforcement logic.
- View graded Submissions and Rubric-based Feedback.
- Profile management.

### **Admin/Coordinator Module**
- Dashboard Statistics.
- User Management (Approve/Reject student and faculty registrations).
- Proposal Management (Approve/Reject).
- Panel Assignments (Assign Jury members and Student groups with defense slots).
- Announcements (Create/Pin/Delete global or role-specific updates).

### **Security & Storage**
- JWT Authentication & bcrypt password hashing.
- Role-Based Access Control (RBAC) middleware guarding routes.
- `multer` setup for local file uploads (saved in `backend/uploads/`).

## 🔗 Frontend Integration

The React frontend has been connected to the new API:
1. **API Service (`src/app/services/api.ts`)**: A centralized `fetch` wrapper handling JWT tokens seamlessly.
2. **Auth Context (`src/app/context/AuthContext.tsx`)**: Global authentication state management using real API endpoints.
3. **Pages Updated**:
   - `Login.tsx`: Uses the backend `/api/auth/login` and navigates based on the user's role.
   - `StudentDashboard.tsx`, `Milestones.tsx`, `Feedback.tsx`: Now fetch and submit real data.
   - `Admin/UserManagement.tsx`, `Announcements.tsx`, `PanelAssignment.tsx`: Fully functional with the backend APIs.

## 🤝 Extension Guide for Your Partner (Supervisor & Jury)

I have placed clear extension points in the codebase for your partner to add their roles cleanly:

1. **Routes**: Check `src/adapters/http/routes/supervisor.routes.js` and `jury.routes.js`. They contain `TODO` comments detailing exact endpoints needed.
2. **Models & Repositories**: All necessary DB models (Feedback, Panel, Milestone) and repositories are already built and ready to be used.
3. **Use Cases**: They simply need to add their logic in `src/application/supervisor/` and `src/application/jury/`.

---

**Next Steps:**
- Run `npm install` in the `backend/` directory.
- Ensure your MongoDB Atlas URI is correctly set in `backend/.env`.
- Start the backend using `npm run dev` and test the integrated flows from your React frontend!
