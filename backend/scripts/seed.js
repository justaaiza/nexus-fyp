require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/adapters/db/models/UserModel');

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Hash the generic password
    const passwordHash = await bcrypt.hash('password123', 10);

    const testUsers = [
      {
        name: 'Admin Coordinator',
        email: 'admin@nu.edu.pk',
        password: passwordHash,
        role: 'admin',
        isApproved: true,
      },
      {
        name: 'Student User',
        email: 'student@nu.edu.pk',
        password: passwordHash,
        role: 'student',
        rollNumber: '26X-0000',
        department: 'CS',
        isApproved: true,
      },
      {
        name: 'Dr. Supervisor',
        email: 'supervisor@nu.edu.pk',
        password: passwordHash,
        role: 'supervisor',
        department: 'CS',
        isApproved: true,
      },
      {
        name: 'Dr. Jury',
        email: 'jury@nu.edu.pk',
        password: passwordHash,
        role: 'jury',
        department: 'SE',
        isApproved: true,
      }
    ];

    console.log('Clearing old test users...');
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });

    console.log('Inserting new test users...');
    await User.insertMany(testUsers);

    console.log('Successfully seeded database with test users!');
    console.log('-----------------------------------');
    console.log('TEST CREDENTIALS:');
    console.log('Password for ALL users: password123');
    console.log('1. Admin: admin@nu.edu.pk');
    console.log('2. Student: student@nu.edu.pk');
    console.log('3. Supervisor: supervisor@nu.edu.pk');
    console.log('4. Jury: jury@nu.edu.pk');
    console.log('-----------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
