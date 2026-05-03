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

async function seedAll() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Fetching existing test users...');
    const admin = await User.findOne({ email: 'admin@nu.edu.pk' });
    const student = await User.findOne({ email: 'student@nu.edu.pk' });
    const supervisor = await User.findOne({ email: 'supervisor@nu.edu.pk' });
    const jury = await User.findOne({ email: 'jury@nu.edu.pk' });

    if (!admin || !student || !supervisor || !jury) {
      console.error('Error: Please run seed.js first to create the base users.');
      process.exit(1);
    }

    console.log('Clearing old collections...');
    await Proposal.deleteMany({});
    await Announcement.deleteMany({});
    await Panel.deleteMany({});
    await Milestone.deleteMany({});
    await Submission.deleteMany({});
    await Feedback.deleteMany({});

    // Create an unapproved student for testing UserManagement
    const passwordHash = await bcrypt.hash('password123', 10);
    await User.deleteMany({ email: 'unapproved@nu.edu.pk' });
    const unapprovedStudent = await User.create({
      name: 'Pending Student',
      email: 'unapproved@nu.edu.pk',
      password: passwordHash,
      role: 'student',
      rollNumber: '26X-9999',
      department: 'CS',
      isApproved: false,
    });
    console.log('Created unapproved student.');

    // Create Proposals
    const approvedProposal = await Proposal.create({
      title: 'Nexus FYP Management System',
      description: 'A comprehensive full-stack solution for managing the FYP lifecycle at FAST NUCES. Includes real-time tracking, rubrics, and automated panel scheduling.',
      teamMembers: [student._id],
      supervisorPreference: supervisor._id,
      submittedBy: student._id,
      status: 'approved',
      groupNo: 'G-01',
    });

    const pendingProposal = await Proposal.create({
      title: 'AI Based Attendance System',
      description: 'Using facial recognition to mark student attendance automatically in classrooms.',
      teamMembers: [unapprovedStudent._id],
      submittedBy: unapprovedStudent._id,
      status: 'pending',
    });
    console.log('Created proposals.');

    // Create Announcements
    await Announcement.create({
      title: 'Welcome to the Spring 2026 FYP Portal',
      content: 'All students must submit their project proposals by the end of week 2. Please ensure your groups are finalized.',
      postedBy: admin._id,
      audience: 'all',
      pinned: true,
      type: 'info',
    });
    await Announcement.create({
      title: 'Jury Panel Assignments Released',
      content: 'The first evaluation panels have been scheduled. Supervisors and Jury members can now view their assigned groups.',
      postedBy: admin._id,
      audience: 'jury',
      pinned: false,
      type: 'success',
    });
    console.log('Created announcements.');

    // Create Panel
    const panelDate = new Date();
    panelDate.setDate(panelDate.getDate() + 7);
    await Panel.create({
      name: 'Panel A - Web Tech',
      juryMembers: [jury._id],
      assignedGroups: [approvedProposal._id],
      defenseDate: panelDate,
    });
    console.log('Created panel.');

    // Create Milestone
    const milestoneDate = new Date();
    milestoneDate.setDate(milestoneDate.getDate() + 14);
    const milestone = await Milestone.create({
      title: 'Software Design Specification (SDS)',
      description: 'Submit your complete SDS document outlining architecture, DB schema, and UI wireframes.',
      deadline: milestoneDate,
      phase: 'FYP-1',
      createdBy: supervisor._id,
      assignedTo: [student._id],
    });
    console.log('Created milestone.');

    // Create Submission
    const submission = await Submission.create({
      milestone: milestone._id,
      submittedBy: student._id,
      fileUrl: '/uploads/dummy_sds.pdf',
      fileType: 'pdf',
      status: 'graded',
    });
    console.log('Created submission.');

    // Create Feedback
    await Feedback.create({
      submission: submission._id,
      givenBy: supervisor._id,
      comment: 'Excellent architecture design! The database schema is very well normalized. Ensure to add more detail in the API section.',
      grade: 92,
    });
    console.log('Created feedback.');

    console.log('-----------------------------------');
    console.log('SUCCESS: Database successfully seeded with full relational mock data!');
    console.log('You can now log in with the test credentials and view active proposals, milestones, submissions, and feedback.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedAll();
