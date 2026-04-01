import { createBrowserRouter, Navigate } from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/app",
    Component: Layout,
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
      // Admin
      { path: "admin/panels", Component: AdminPanels },
      { path: "admin/users", Component: AdminUsers },
      { path: "admin/announcements", Component: AdminAnnouncements },
      // Jury
      { path: "jury/projects", Component: JuryProjects },
      { path: "jury/deliverables", Component: JuryDeliverables },
      { path: "jury/scores", Component: JuryScores },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
