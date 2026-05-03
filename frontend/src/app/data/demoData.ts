export const studentDashboardProjectDemo = {
  groupNo: "G-08",
  title: "Nexus Attendance Intelligence",
  domain: "AI + Web",
  proposalStatus: "Approved",
  supervisor: {
    name: "Dr. Sara Khurram",
    email: "sara.khurram@nu.edu.pk",
  },
  summary:
    "A smart attendance platform that combines facial verification and analytics dashboards to improve classroom engagement tracking.",
  repoUrl: "https://github.com/nexus-fyp/g08-attendance-intelligence",
  techStack: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
};

export const studentDashboardTeamMembersDemo = [
  { name: "Areeba Malik", roll: "22K-4543", role: "Lead" },
  { name: "Hamza Javed", roll: "22K-4531", role: "Member" },
  { name: "Musa Farooq", roll: "22K-4577", role: "Member" },
];

export const studentDashboardTimelineDemo = [
  { phase: "Proposal Submission", date: "12 Feb 2026", status: "completed" },
  { phase: "SRS & Architecture Review", date: "06 Mar 2026", status: "completed" },
  { phase: "Mid Evaluation", date: "18 Apr 2026", status: "upcoming" },
  { phase: "Final Deliverables", date: "20 May 2026", status: "upcoming" },
  { phase: "Defense", date: "03 Jun 2026", status: "locked" },
];

export const studentDashboardRecentActivityDemo = [
  {
    id: 1,
    title: "Uploaded SRS v2",
    detail: "Document accepted and visible to supervisor.",
    time: "Today, 10:42 AM",
    type: "submission",
  },
  {
    id: 2,
    title: "Supervisor feedback received",
    detail: "3 comments added on architecture section.",
    time: "Yesterday",
    type: "feedback",
  },
  {
    id: 3,
    title: "Weekly sync scheduled",
    detail: "Meeting with supervisor set for Friday 2:30 PM.",
    time: "2 days ago",
    type: "meeting",
  },
  {
    id: 4,
    title: "Proposal status updated",
    detail: "Coordinator marked proposal as approved.",
    time: "5 days ago",
    type: "status",
  },
];

export const studentMilestonesDemo = [
  {
    id: 1,
    title: "SRS Document",
    description: "Submit Software Requirements Specification with problem statement, use-cases, and constraints.",
    deadline: "06 Mar 2026",
    status: "graded",
    grade: "A-",
    file: "G08_SRS_v2.pdf",
    fileSize: "2.6 MB",
    types: ["PDF"],
  },
  {
    id: 2,
    title: "Architecture & Design",
    description: "Provide architecture diagrams, API contracts, and deployment flow.",
    deadline: "21 Mar 2026",
    status: "submitted",
    grade: null,
    file: "G08_Architecture.zip",
    fileSize: "8.1 MB",
    types: ["PDF", "ZIP"],
  },
  {
    id: 3,
    title: "Mid Evaluation Package",
    description: "Upload demo video, progress report, and latest source snapshot.",
    deadline: "18 Apr 2026",
    status: "pending",
    grade: null,
    file: null,
    fileSize: null,
    types: ["PDF", "ZIP", "MP4"],
  },
  {
    id: 4,
    title: "Final Deliverables",
    description: "Complete final report, source code archive, and test evidence.",
    deadline: "20 May 2026",
    status: "pending",
    grade: null,
    file: null,
    fileSize: null,
    types: ["PDF", "ZIP"],
  },
  {
    id: 5,
    title: "Defense Recording",
    description: "Upload final defense recording and presentation slides after panel evaluation.",
    deadline: "03 Jun 2026",
    status: "locked",
    grade: null,
    file: null,
    fileSize: null,
    types: ["MP4", "PDF"],
  },
];

export const studentFeedbackItemsDemo = [
  {
    id: 1,
    milestone: "SRS Document",
    submittedDate: "05 Mar 2026",
    gradedDate: "08 Mar 2026",
    grade: "A-",
    gradeScore: 84,
    maxScore: 100,
    gradedBy: "Dr. Sara Khurram",
    rubric: [
      { criteria: "Problem Definition", score: 17, max: 20, comment: "Clear context and motivation, but success metrics can be sharper." },
      { criteria: "Scope & Feasibility", score: 16, max: 20, comment: "Scope is realistic for two semesters and technically feasible." },
      { criteria: "Requirements Quality", score: 26, max: 30, comment: "Functional requirements are well structured with good traceability." },
      { criteria: "Use Cases & Flow", score: 15, max: 20, comment: "Flow is complete; add more exception scenarios." },
      { criteria: "Writing & Structure", score: 10, max: 10, comment: "Well-formatted and easy to follow." },
    ],
    overallFeedback:
      "Strong submission overall. Prioritize measurable KPIs and include non-functional benchmarks before the next review.",
  },
  {
    id: 2,
    milestone: "Architecture & Design",
    submittedDate: "20 Mar 2026",
    gradedDate: "24 Mar 2026",
    grade: "B+",
    gradeScore: 78,
    maxScore: 100,
    gradedBy: "Dr. Sara Khurram",
    rubric: [
      { criteria: "System Architecture", score: 23, max: 30, comment: "Layered architecture is sound; include resilience paths for failures." },
      { criteria: "Database Design", score: 15, max: 20, comment: "Schema is normalized with proper keys and indexing approach." },
      { criteria: "API Contracts", score: 16, max: 20, comment: "Core endpoints are defined; error models should be more consistent." },
      { criteria: "Security Considerations", score: 11, max: 15, comment: "Authentication covered, but logging/auditing details are missing." },
      { criteria: "Documentation Clarity", score: 13, max: 15, comment: "Readable diagrams and explanations." },
    ],
    overallFeedback:
      "Good progress. Focus next sprint on robust API validation and operational concerns to improve production readiness.",
  },
];

export const supervisorRequestsDemo = [
  {
    id: 1,
    groupNo: "G-08",
    title: "Nexus Attendance Intelligence",
    lead: "Areeba Malik",
    roll: "22K-4543",
    email: "k224543@nu.edu.pk",
    members: 3,
    stack: "React, FastAPI, PostgreSQL",
    abstract:
      "Our project introduces an AI-assisted attendance platform with identity verification and engagement analytics for instructors.",
    status: "pending",
    requestedDate: "2 days ago",
  },
  {
    id: 2,
    groupNo: "G-11",
    title: "MediFlow Triage Assistant",
    lead: "Hamza Nadeem",
    roll: "22K-4180",
    email: "k224180@nu.edu.pk",
    members: 4,
    stack: "Next.js, Node, MongoDB",
    abstract:
      "A triage support system for clinics that prioritizes patients based on symptoms and waiting time predictions.",
    status: "accepted",
    requestedDate: "1 week ago",
  },
  {
    id: 3,
    groupNo: "G-14",
    title: "Smart Hostel Utility Monitor",
    lead: "Musa Farooq",
    roll: "22K-4577",
    email: "k224577@nu.edu.pk",
    members: 3,
    stack: "Flutter, Firebase, IoT",
    abstract:
      "The system tracks electricity and water usage in hostels and suggests consumption optimizations in real time.",
    status: "pending",
    requestedDate: "Today",
  },
  {
    id: 4,
    groupNo: "G-03",
    title: "Campus Parking Optimizer",
    lead: "Mahnoor Tariq",
    roll: "22K-4012",
    email: "k224012@nu.edu.pk",
    members: 4,
    stack: "Vue, Go, Redis",
    abstract:
      "A route and slot recommendation engine to reduce congestion and parking search times on campus.",
    status: "rejected",
    requestedDate: "10 days ago",
  },
];

export const supervisorGroupsDemo = ["G-08", "G-11", "G-14", "G-21"];

export const supervisorMilestonesDemo = [
  {
    id: 1,
    title: "SRS Submission",
    description: "Students must submit updated SRS with finalized requirements and use cases.",
    deadline: "2026-03-06",
    groups: ["G-08", "G-11", "G-14", "G-21"],
    submittedCount: 4,
    type: "Document",
    status: "past",
  },
  {
    id: 2,
    title: "Architecture Review Package",
    description: "Submit architecture diagrams, database schema, and deployment overview.",
    deadline: "2026-04-18",
    groups: ["G-08", "G-11", "G-14"],
    submittedCount: 2,
    type: "Code",
    status: "active",
  },
  {
    id: 3,
    title: "Mid-Term Defense",
    description: "Prepare slide deck and demo video for mid-term project defense.",
    deadline: "2026-05-02",
    groups: ["G-08", "G-11", "G-14", "G-21"],
    submittedCount: 0,
    type: "Defense",
    status: "upcoming",
  },
];

export const supervisorEvaluationSubmissionsDemo = [
  {
    id: 1,
    group: "G-08",
    title: "Nexus Attendance Intelligence",
    lead: "Areeba Malik",
    milestone: "Architecture Review",
    submittedDate: "21 Mar 2026",
    file: "G08_Architecture_v3.pdf",
    fileSize: "3.1 MB",
    status: "pending",
    existingGrades: null,
    existingFeedback: "",
  },
  {
    id: 2,
    group: "G-11",
    title: "MediFlow Triage Assistant",
    lead: "Hamza Nadeem",
    milestone: "Architecture Review",
    submittedDate: "20 Mar 2026",
    file: "G11_Architecture.pdf",
    fileSize: "2.4 MB",
    status: "graded",
    existingGrades: {
      completeness: 21,
      technical: 20,
      clarity: 16,
      diagrams: 13,
      presentation: 12,
    },
    existingFeedback:
      "Strong design rationale and modular decomposition. Add stronger threat modeling for production deployment.",
  },
  {
    id: 3,
    group: "G-14",
    title: "Smart Hostel Utility Monitor",
    lead: "Musa Farooq",
    milestone: "Architecture Review",
    submittedDate: "22 Mar 2026",
    file: "G14_Architecture.zip",
    fileSize: "6.7 MB",
    status: "pending",
    existingGrades: null,
    existingFeedback: "",
  },
];

export const adminUsersDemo = [
  {
    id: 1,
    name: "Areeba Malik",
    email: "k224543@nu.edu.pk",
    role: "student",
    dept: "CS",
    reg: "22K-4543",
    requestedDate: "Mar 10, 2026",
    status: "approved",
  },
  {
    id: 2,
    name: "Hamza Nadeem",
    email: "k224180@nu.edu.pk",
    role: "student",
    dept: "SE",
    reg: "22K-4180",
    requestedDate: "Mar 12, 2026",
    status: "pending",
  },
  {
    id: 3,
    name: "Dr. Sara Khurram",
    email: "sara.khurram@nu.edu.pk",
    role: "supervisor",
    dept: "CS",
    reg: "EMP-1042",
    requestedDate: "Mar 08, 2026",
    status: "approved",
  },
  {
    id: 4,
    name: "Dr. Omer Raza",
    email: "omer.raza@nu.edu.pk",
    role: "jury",
    dept: "AI",
    reg: "EMP-1187",
    requestedDate: "Mar 15, 2026",
    status: "pending",
  },
  {
    id: 5,
    name: "Dr. Saba Irfan",
    email: "saba.irfan@nu.edu.pk",
    role: "supervisor",
    dept: "DS",
    reg: "EMP-1021",
    requestedDate: "Mar 04, 2026",
    status: "rejected",
  },
  {
    id: 6,
    name: "Musa Farooq",
    email: "k224577@nu.edu.pk",
    role: "student",
    dept: "CS",
    reg: "22K-4577",
    requestedDate: "Mar 11, 2026",
    status: "approved",
  },
];

export const adminPanelGroupsDemo = [
  { id: "G-08", title: "Nexus Attendance Intelligence", lead: "Areeba Malik", members: 3 },
  { id: "G-11", title: "MediFlow Triage Assistant", lead: "Hamza Nadeem", members: 4 },
  { id: "G-14", title: "Smart Hostel Utility Monitor", lead: "Musa Farooq", members: 3 },
  { id: "G-21", title: "Retail Demand Forecaster", lead: "Saman Riaz", members: 4 },
  { id: "G-04", title: "Campus Parking Optimizer", lead: "Mahnoor Tariq", members: 4 },
];

export const adminPanelJurorsDemo = [
  { id: "J-01", name: "Dr. Omer Raza", dept: "AI", expertise: "Computer Vision" },
  { id: "J-02", name: "Dr. Nida Tariq", dept: "SE", expertise: "Software Architecture" },
  { id: "J-03", name: "Dr. Bilal Qureshi", dept: "CS", expertise: "Databases" },
  { id: "J-04", name: "Dr. Maha Qasim", dept: "DS", expertise: "Data Engineering" },
  { id: "J-05", name: "Dr. Adnan Rauf", dept: "CS", expertise: "Cloud Systems" },
];

export const adminDefenseSlotsDemo = [
  "Mon, 27 Apr · 09:00-10:00",
  "Mon, 27 Apr · 10:15-11:15",
  "Tue, 28 Apr · 09:00-10:00",
  "Tue, 28 Apr · 11:30-12:30",
];

export const adminInitialPanelsDemo = [
  {
    id: 1,
    groups: ["G-08", "G-11"],
    jurors: ["J-01", "J-02", "J-03"],
    slot: "Mon, 27 Apr · 09:00-10:00",
    room: "CR-103",
  },
  {
    id: 2,
    groups: ["G-14"],
    jurors: ["J-02", "J-04", "J-05"],
    slot: "Mon, 27 Apr · 10:15-11:15",
    room: "Lab-07",
  },
];

export const adminAnnouncementsDemo = [
  {
    id: 1,
    title: "Mid Evaluation Schedule Published",
    body: "Panel slots for mid evaluations are now available under Panel Assignment. Group leads must confirm availability by Friday.",
    audience: "all",
    date: "Mar 28, 2026",
    pinned: true,
    type: "info",
  },
  {
    id: 2,
    title: "Architecture Review Deadline Reminder",
    body: "All student groups must upload architecture and design files before 18 Apr, 11:59 PM. Late submissions will be flagged.",
    audience: "students",
    date: "Mar 30, 2026",
    pinned: false,
    type: "warning",
  },
  {
    id: 3,
    title: "Jury Rubric Updated",
    body: "A revised scoring rubric has been shared with all jury members. Please review criteria before upcoming evaluations.",
    audience: "jury",
    date: "Mar 25, 2026",
    pinned: false,
    type: "success",
  },
  {
    id: 4,
    title: "Supervisor Meeting Window Open",
    body: "Supervisors can now schedule weekly consultation windows directly from the Requests and Milestones modules.",
    audience: "supervisors",
    date: "Mar 22, 2026",
    pinned: false,
    type: "info",
  },
];

export const juryAssignedProjectsDemo = [
  {
    id: 1,
    groupNo: "G-08",
    title: "Nexus Attendance Intelligence",
    lead: "Areeba Malik",
    members: ["Areeba Malik", "Hamza Javed", "Musa Farooq"],
    supervisor: "Dr. Sara Khurram",
    stack: "React + FastAPI",
    defenseDate: "Mon, 27 Apr 2026",
    room: "CR-103",
    status: "pending",
    githubUrl: "https://github.com/nexus-fyp/g08-attendance-intelligence",
    description:
      "An attendance analytics platform that combines face verification and engagement dashboards for instructors and coordinators.",
    deliverables: [
      { name: "SRS Document", type: "PDF", submitted: true },
      { name: "Architecture Report", type: "PDF", submitted: true },
      { name: "Mid Demo Video", type: "MP4", submitted: false },
    ],
  },
  {
    id: 2,
    groupNo: "G-11",
    title: "MediFlow Triage Assistant",
    lead: "Hamza Nadeem",
    members: ["Hamza Nadeem", "Sana Iqbal", "Faraz Ali", "Hiba Noor"],
    supervisor: "Dr. Hina Masood",
    stack: "Next.js + Node",
    defenseDate: "Mon, 27 Apr 2026",
    room: "CR-103",
    status: "scored",
    githubUrl: "https://github.com/nexus-fyp/g11-mediflow",
    description:
      "A triage decision-support system for OPD intake, prioritizing patient flow using symptom severity and queue prediction.",
    deliverables: [
      { name: "SRS Document", type: "PDF", submitted: true },
      { name: "Architecture Report", type: "PDF", submitted: true },
      { name: "Code Snapshot", type: "ZIP", submitted: true },
    ],
  },
  {
    id: 3,
    groupNo: "G-14",
    title: "Smart Hostel Utility Monitor",
    lead: "Musa Farooq",
    members: ["Musa Farooq", "Taha Saeed", "Aiman Jamil"],
    supervisor: "Dr. Farah Nadeem",
    stack: "Flutter + Firebase",
    defenseDate: "Tue, 28 Apr 2026",
    room: "Lab-07",
    status: "pending",
    githubUrl: "https://github.com/nexus-fyp/g14-utility-monitor",
    description:
      "A utility monitoring platform for hostels with real-time usage alerts and predictive monthly consumption insights.",
    deliverables: [
      { name: "SRS Document", type: "PDF", submitted: true },
      { name: "Architecture Report", type: "PDF", submitted: false },
      { name: "Prototype Video", type: "MP4", submitted: false },
    ],
  },
];

export const juryPanelInfoDemo = {
  name: "Panel A",
  slot: "Mon, 27 Apr · 09:00-10:00",
};

export const juryDeliverablesProjectsDemo = [
  {
    id: 1,
    groupNo: "G-08",
    title: "Nexus Attendance Intelligence",
    githubUrl: "https://github.com/nexus-fyp/g08-attendance-intelligence",
    commits: 126,
    contributors: [
      { name: "Areeba Malik", commits: 52, additions: 6420, deletions: 2100, avatar: "AM" },
      { name: "Hamza Javed", commits: 41, additions: 4980, deletions: 1720, avatar: "HJ" },
      { name: "Musa Farooq", commits: 33, additions: 3890, deletions: 1410, avatar: "MF" },
    ],
    documents: [
      { name: "SRS_v2.pdf", type: "pdf", size: "2.6 MB", submitted: "06 Mar 2026", milestone: "SRS" },
      { name: "Architecture_Package.zip", type: "zip", size: "8.1 MB", submitted: "21 Mar 2026", milestone: "Architecture" },
      { name: "Mid_Demo.mp4", type: "mp4", size: "54.3 MB", submitted: "17 Apr 2026", milestone: "Mid Eval" },
    ],
  },
  {
    id: 2,
    groupNo: "G-11",
    title: "MediFlow Triage Assistant",
    githubUrl: "https://github.com/nexus-fyp/g11-mediflow",
    commits: 98,
    contributors: [
      { name: "Hamza Nadeem", commits: 37, additions: 4310, deletions: 1602, avatar: "HN" },
      { name: "Sana Iqbal", commits: 26, additions: 3120, deletions: 1240, avatar: "SI" },
      { name: "Faraz Ali", commits: 21, additions: 2525, deletions: 901, avatar: "FA" },
      { name: "Hiba Noor", commits: 14, additions: 1804, deletions: 640, avatar: "HN" },
    ],
    documents: [
      { name: "SRS.pdf", type: "pdf", size: "2.1 MB", submitted: "05 Mar 2026", milestone: "SRS" },
      { name: "Design_Report.pdf", type: "pdf", size: "3.0 MB", submitted: "20 Mar 2026", milestone: "Architecture" },
      { name: "Code_Snapshot.zip", type: "zip", size: "12.4 MB", submitted: "16 Apr 2026", milestone: "Mid Eval" },
    ],
  },
];

export const juryGroupsDemo = [
  {
    id: 1,
    groupNo: "G-08",
    title: "Nexus Attendance Intelligence",
    members: [
      { name: "Areeba Malik", roll: "22K-4543" },
      { name: "Hamza Javed", roll: "22K-4531" },
      { name: "Musa Farooq", roll: "22K-4577" },
    ],
  },
  {
    id: 2,
    groupNo: "G-11",
    title: "MediFlow Triage Assistant",
    members: [
      { name: "Hamza Nadeem", roll: "22K-4180" },
      { name: "Sana Iqbal", roll: "22K-4366" },
      { name: "Faraz Ali", roll: "22K-4451" },
      { name: "Hiba Noor", roll: "22K-4485" },
    ],
  },
  {
    id: 3,
    groupNo: "G-14",
    title: "Smart Hostel Utility Monitor",
    members: [
      { name: "Musa Farooq", roll: "22K-4577" },
      { name: "Aiman Jamil", roll: "22K-4610" },
      { name: "Taha Saeed", roll: "22K-4664" },
    ],
  },
];

export const juryInitialScoresDemo: Record<number, Record<string, number>> = {
  2: {
    problem: 13,
    technical: 21,
    design: 12,
    demo: 16,
    presentation: 13,
    qa: 8,
  },
};

export const juryInitialFeedbacksDemo: Record<number, string> = {
  2: "Well balanced presentation with strong technical implementation. Improve handling of edge-case triage conflicts in the next iteration.",
};

export const juryInitialSubmittedIdsDemo = [2];