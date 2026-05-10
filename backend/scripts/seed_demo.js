require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/adapters/db/models/UserModel');
const Proposal = require('../src/adapters/db/models/ProposalModel');
const Announcement = require('../src/adapters/db/models/AnnouncementModel');
const Panel = require('../src/adapters/db/models/PanelModel');
const Milestone = require('../src/adapters/db/models/MilestoneModel');
const Submission = require('../src/adapters/db/models/SubmissionModel');
const Feedback = require('../src/adapters/db/models/FeedbackModel');

async function seedDemoData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Proposal.deleteMany({});
    await Announcement.deleteMany({});
    await Panel.deleteMany({});
    await Milestone.deleteMany({});
    await Submission.deleteMany({});
    await Feedback.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Users
    console.log('Creating users...');
    const usersData = [
      { name: 'Admin User', email: 'admin@nu.edu.pk', password: passwordHash, role: 'admin', isApproved: true },
      { name: 'Areeba Malik', email: 'l224543@nu.edu.pk', password: passwordHash, role: 'student', rollNumber: '22K-4543', department: 'CS', isApproved: true },
      { name: 'Hamza Javed', email: 'l224531@nu.edu.pk', password: passwordHash, role: 'student', rollNumber: '22K-4531', department: 'CS', isApproved: true },
      { name: 'Musa Farooq', email: 'l224577@nu.edu.pk', password: passwordHash, role: 'student', rollNumber: '22K-4577', department: 'CS', isApproved: true },
      { name: 'Hamza Nadeem', email: 'l224180@nu.edu.pk', password: passwordHash, role: 'student', rollNumber: '22K-4180', department: 'SE', isApproved: false },
      { name: 'Dr. Sara Khurram', email: 'sara.khurram@nu.edu.pk', password: passwordHash, role: 'supervisor', department: 'CS', isApproved: true },
      { name: 'Dr. Omer Raza', email: 'omer.raza@nu.edu.pk', password: passwordHash, role: 'jury', department: 'AI', isApproved: true },
      { name: 'Dr. Nida Tariq', email: 'nida.tariq@nu.edu.pk', password: passwordHash, role: 'jury', department: 'SE', isApproved: true },
      { name: 'Dr. Bilal Qureshi', email: 'bilal.qureshi@nu.edu.pk', password: passwordHash, role: 'jury', department: 'CS', isApproved: true },
      { name: 'Dr. Maha Qasim', email: 'maha.qasim@nu.edu.pk', password: passwordHash, role: 'jury', department: 'DS', isApproved: true },
      { name: 'Dr. Adnan Rauf', email: 'adnan.rauf@nu.edu.pk', password: passwordHash, role: 'jury', department: 'CS', isApproved: true },
    ];

    const createdUsers = await User.insertMany(usersData);
    const userMap = {};
    createdUsers.forEach(u => userMap[u.email] = u);
    console.log(`Created ${createdUsers.length} users.`);

    // 2. Create Proposals
    console.log('Creating proposals...');
    const proposalsData = [
      {
        title: 'Nexus Attendance Intelligence',
        description: 'A smart attendance platform that combines facial verification and analytics dashboards to improve classroom engagement tracking.',
        teamMembers: [userMap['k224543@nu.edu.pk']._id, userMap['k224531@nu.edu.pk']._id, userMap['k224577@nu.edu.pk']._id],
        supervisorPreference: userMap['sara.khurram@nu.edu.pk']._id,
        assignedSupervisor: userMap['sara.khurram@nu.edu.pk']._id,
        submittedBy: userMap['k224543@nu.edu.pk']._id,
        status: 'approved',
        domain: 'AI + Web',
        techStack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL'],
        groupNo: 'G-08',
        repoUrl: 'https://github.com/nexus-fyp/g08-attendance-intelligence'
      },
      {
        title: 'MediFlow Triage Assistant',
        description: 'A triage support system for clinics that prioritizes patients based on symptoms and waiting time predictions.',
        teamMembers: [userMap['k224180@nu.edu.pk']._id],
        submittedBy: userMap['k224180@nu.edu.pk']._id,
        status: 'pending',
        domain: 'Healthcare AI',
        techStack: ['Next.js', 'Node', 'MongoDB'],
        groupNo: 'G-11'
      }
    ];

    const createdProposals = await Proposal.insertMany(proposalsData);
    console.log(`Created ${createdProposals.length} proposals.`);

    // 3. Create Milestones
    console.log('Creating milestones...');
    const milestonesData = [
      {
        title: 'SRS Document',
        description: 'Submit Software Requirements Specification with problem statement, use-cases, and constraints.',
        deadline: new Date('2026-03-06'),
        phase: 'FYP-1',
        type: 'document',
        createdBy: userMap['sara.khurram@nu.edu.pk']._id,
        assignedTo: [userMap['k224543@nu.edu.pk']._id]
      },
      {
        title: 'Architecture & Design',
        description: 'Provide architecture diagrams, API contracts, and deployment flow.',
        deadline: new Date('2026-03-21'),
        phase: 'FYP-1',
        type: 'document',
        createdBy: userMap['sara.khurram@nu.edu.pk']._id,
        assignedTo: [userMap['k224543@nu.edu.pk']._id]
      }
    ];

    const createdMilestones = await Milestone.insertMany(milestonesData);
    console.log(`Created ${createdMilestones.length} milestones.`);

    // 4. Create Submissions
    console.log('Creating submissions...');
    const submissionsData = [
      {
        milestone: createdMilestones[0]._id,
        submittedBy: userMap['k224543@nu.edu.pk']._id,
        fileUrl: '/uploads/G08_SRS_v2.pdf',
        fileType: 'pdf',
        status: 'graded',
        submittedAt: new Date('2026-03-05')
      },
      {
        milestone: createdMilestones[1]._id,
        submittedBy: userMap['k224543@nu.edu.pk']._id,
        fileUrl: '/uploads/G08_Architecture.zip',
        fileType: 'zip',
        status: 'submitted',
        submittedAt: new Date('2026-03-20')
      }
    ];

    const createdSubmissions = await Submission.insertMany(submissionsData);
    console.log(`Created ${createdSubmissions.length} submissions.`);

    // 5. Create Feedback
    console.log('Creating feedback...');
    const feedbackData = [
      {
        submission: createdSubmissions[0]._id,
        givenBy: userMap['sara.khurram@nu.edu.pk']._id,
        comment: 'Strong submission overall. Prioritize measurable KPIs and include non-functional benchmarks before the next review.',
        grade: 84
      }
    ];

    await Feedback.insertMany(feedbackData);
    console.log('Created feedback.');

    // 6. Create Announcements
    console.log('Creating announcements...');
    const announcementsData = [
      {
        title: 'Mid Evaluation Schedule Published',
        content: 'Panel slots for mid evaluations are now available under Panel Assignment. Group leads must confirm availability by Friday.',
        postedBy: userMap['admin@nu.edu.pk']._id,
        audience: 'all',
        pinned: true,
        type: 'info'
      },
      {
        title: 'Architecture Review Deadline Reminder',
        content: 'All student groups must upload architecture and design files before 18 Apr, 11:59 PM. Late submissions will be flagged.',
        postedBy: userMap['admin@nu.edu.pk']._id,
        audience: 'students',
        pinned: false,
        type: 'warning'
      }
    ];

    await Announcement.insertMany(announcementsData);
    console.log('Created announcements.');

    // 7. Create Panels
    console.log('Creating panels...');
    const panelsData = [
      {
        name: 'Panel A',
        juryMembers: [userMap['omer.raza@nu.edu.pk']._id, userMap['nida.tariq@nu.edu.pk']._id, userMap['bilal.qureshi@nu.edu.pk']._id],
        assignedGroups: [createdProposals[0]._id, createdProposals[1]._id],
        defenseDate: new Date('2026-04-27T09:00:00'),
        room: 'CR-103'
      }
    ];

    await Panel.insertMany(panelsData);
    console.log('Created panels.');

    console.log('-----------------------------------');
    console.log('SUCCESS: Demo data successfully migrated to database!');
    console.log('Test Credentials:');
    console.log('- Admin: admin@nu.edu.pk / password123');
    console.log('- Student (G-08 Lead): k224543@nu.edu.pk / password123');
    console.log('- Supervisor: sara.khurram@nu.edu.pk / password123');
    console.log('- Jury: omer.raza@nu.edu.pk / password123');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

seedDemoData();
