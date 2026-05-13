require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/adapters/db/models/UserModel');
const Group = require('../src/adapters/db/models/GroupModel');
const Proposal = require('../src/adapters/db/models/ProposalModel');
const Announcement = require('../src/adapters/db/models/AnnouncementModel');
const Panel = require('../src/adapters/db/models/PanelModel');
const Milestone = require('../src/adapters/db/models/MilestoneModel');
const Submission = require('../src/adapters/db/models/SubmissionModel');
const Feedback = require('../src/adapters/db/models/FeedbackModel');

async function seedMaster() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Group.deleteMany({});
    await Proposal.deleteMany({});
    await Announcement.deleteMany({});
    await Panel.deleteMany({});
    await Milestone.deleteMany({});
    await Submission.deleteMany({});
    await Feedback.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    console.log('Creating Admin...');
    const admin = await User.create({
      name: 'Admin Coordinator',
      email: 'admin@nu.edu.pk',
      password: passwordHash,
      role: 'admin',
      isApproved: true,
    });

    console.log('Creating Supervisors...');
    const supervisors = await User.insertMany(Array.from({ length: 5 }).map((_, i) => ({
      name: `Dr. Supervisor ${i + 1}`,
      email: `supervisor${i + 1}@nu.edu.pk`,
      password: passwordHash,
      role: 'supervisor',
      department: 'CS',
      isApproved: true,
    })));

    console.log('Creating Jury Members...');
    const juries = await User.insertMany(Array.from({ length: 5 }).map((_, i) => ({
      name: `Dr. Jury ${i + 1}`,
      email: `jury${i + 1}@nu.edu.pk`,
      password: passwordHash,
      role: 'jury',
      department: ['CS', 'SE', 'AI'][i % 3],
      isApproved: true,
    })));

    console.log('Creating Students...');
    const students = await User.insertMany(Array.from({ length: 25 }).map((_, i) => ({
      name: `Student ${i + 1}`,
      email: `student${i + 1}@nu.edu.pk`,
      password: passwordHash,
      role: 'student',
      rollNumber: `26X-${(i + 1).toString().padStart(4, '0')}`,
      department: 'CS',
      isApproved: i < 20, // First 20 are approved, 5 pending
    })));

    console.log('Creating Announcements...');
    await Announcement.create({
      title: 'Welcome to the Spring 2026 FYP Portal',
      content: 'All students must submit their project proposals by the end of week 2.',
      postedBy: admin._id,
      audience: 'all',
      pinned: true,
      type: 'info',
    });
    await Announcement.create({
      title: 'Jury Panel Assignments Released',
      content: 'The first evaluation panels have been scheduled.',
      postedBy: admin._id,
      audience: 'jury',
      pinned: false,
      type: 'success',
    });

    console.log('Creating Proposals & Groups...');
    const proposals = [];
    for (let i = 0; i < 5; i++) {
      const leader = students[i * 3]._id;
      const mem1 = students[i * 3 + 1]._id;
      const mem2 = students[i * 3 + 2]._id;

      // Group formation
      await Group.create({
        leader: leader,
        members: [{ user: mem1, status: 'accepted' }, { user: mem2, status: 'accepted' }],
        status: 'formed'
      });

      const propStatus = ['approved', 'pending', 'approved', 'rejected', 'approved'][i];

      proposals.push(await Proposal.create({
        title: `Project Proposal ${i + 1}: AI Integration`,
        description: `Description for project ${i + 1}. A comprehensive AI-driven problem solver.`,
        teamMembers: [mem1, mem2],
        supervisorPreference: supervisors[i]._id,
        assignedSupervisor: propStatus === 'approved' ? supervisors[i]._id : null,
        submittedBy: leader,
        status: propStatus,
        rejectionReason: propStatus === 'rejected' ? 'Scope too broad for current timeline.' : null,
        groupNo: i % 2 === 0 ? `G-0${i + 1}` : undefined, // Assined group nums conditionally
      }));
    }

    console.log('Creating Panels for Approved Proposals...');
    const approvedProposals = proposals.filter((p) => p.status === 'approved');
    const panelDate = new Date();
    panelDate.setDate(panelDate.getDate() + 7);
    await Panel.create({
      name: 'Panel A - Web & AI Tech',
      juryMembers: [juries[0]._id, juries[1]._id, juries[2]._id],
      assignedGroups: approvedProposals.map(p => p._id),
      defenseDate: panelDate,
    });

    console.log('Creating Milestones...');
    const milestoneDate = new Date();
    milestoneDate.setDate(milestoneDate.getDate() + 14);
    
    // Only assign milestones to students who are part of an approved proposal
    const studentsWithApprovedProposals = new Set();
    approvedProposals.forEach((p) => {
      if (p.submittedBy) studentsWithApprovedProposals.add(p.submittedBy.toString());
      (p.teamMembers || []).forEach((m) => studentsWithApprovedProposals.add(m.toString()));
    });
    const assignedStudentIds = Array.from(studentsWithApprovedProposals);

    const milestone = await Milestone.create({
      title: 'Software Design Specification (SDS)',
      description: 'Submit your complete SDS document outlining architecture.',
      deadline: milestoneDate,
      phase: 'FYP-1',
      type: 'document',
      createdBy: supervisors[0]._id,
      assignedTo: assignedStudentIds,
    });

    const defenseMilestone = await Milestone.create({
      title: 'Final Defense',
      description: 'Prepare your presentation and present your project to the jury.',
      deadline: milestoneDate,
      phase: 'FYP-2',
      type: 'defence',
      createdBy: supervisors[0]._id,
      assignedTo: assignedStudentIds,
    });

    console.log('Creating Submissions & Feedback...');
    // We only attach submission / feedback to the first approved proposal's team to avoid data mismatch
    const firstApprovedTeamLeader = approvedProposals[0].submittedBy;

    const submission = await Submission.create({
      milestone: milestone._id,
      submittedBy: firstApprovedTeamLeader,
      fileUrl: '/uploads/dummy_sds.pdf',
      fileName: 'dummy_sds.pdf',
      fileSize: 524288,
      fileType: 'pdf',
      status: 'graded',
    });

    await Feedback.create({
      submission: submission._id,
      givenBy: approvedProposals[0].assignedSupervisor, // matching the supervisor of the proposal
      comment: 'Excellent architecture design! Ensure to add more detail in the API section.',
      grade: 92,
    });

    console.log('-----------------------------------');
    console.log('SUCCESS: Seeded database with a comprehensive dataset!');
    console.log('TEST CREDENTIALS (Password for all: password123)');
    console.log('Admin:       admin@nu.edu.pk');
    console.log('Students:    student1@nu.edu.pk ... student25@nu.edu.pk');
    console.log('Supervisors: supervisor1@nu.edu.pk ... supervisor5@nu.edu.pk');
    console.log('Juries:      jury1@nu.edu.pk ... jury5@nu.edu.pk');
    console.log('-----------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedMaster();