import { createBrowserRouter, Navigate, useLocation } from "react-router";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/Login";
import { StudentDashboard } from "./pages/student/Dashboard";
import { StudentMilestones } from "./pages/student/Milestones";
import { StudentFeedback } from "./pages/student/Feedback";
import { SupervisorRequests } from "./pages/supervisor/Requests";
import { SupervisorMilestones } from "./pages/supervisor/MilestoneCreation";
import { SupervisorEvaluation } from "./pages/supervisor/Evaluation";
import { AdminPanels } from "./pages/admin/PanelAssignment";
import { AdminUsers } from "./pages/admin/UserManagement";
import { AdminAnnouncements } from "./pages/admin/Announcements";
import { JuryProjects } from "./pages/jury/Projects";
import { JuryDeliverables } from "./pages/jury/Deliverables";
import { JuryScores } from "./pages/jury/Scores";
import { SettingsPage } from "./pages/Settings";
import { SignupPage } from "./pages/Signup";
import { useAuth } from "./context/AuthContext";

const ROLE_BASE: Record<string, string> = {
  student: 'student',
  supervisor: 'supervisor',
  admin: 'admin',
  jury: 'jury',
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Enforce role-based access: extract section from path (e.g. /app/admin/users → "admin")
  const pathSection = location.pathname.split('/')[2]; // e.g. "student", "admin", "jury", "supervisor"
  const roleBase = ROLE_BASE[user.role];

  if (pathSection && roleBase && pathSection !== roleBase) {
    // Redirect to the user's correct dashboard home
    return <Navigate to={`/app/${roleBase}/dashboard`} replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="student/dashboard" replace /> },
      // Student
      { path: "student/dashboard", Component: StudentDashboard },
      { path: "student/milestones", Component: StudentMilestones },
      { path: "student/feedback", Component: StudentFeedback },
      // Supervisor
      { path: "supervisor/requests", Component: SupervisorRequests },
      { path: "supervisor/milestones", Component: SupervisorMilestones },
      { path: "supervisor/evaluation", Component: SupervisorEvaluation },
      // // Admin
      { path: "admin/panels", Component: AdminPanels },
      { path: "admin/users", Component: AdminUsers },
      { path: "admin/announcements", Component: AdminAnnouncements },
      // // Jury
      { path: "jury/projects", Component: JuryProjects },
      { path: "jury/deliverables", Component: JuryDeliverables },
      { path: "jury/scores", Component: JuryScores },
      // Global Settings
      { path: "settings", Component: SettingsPage },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
