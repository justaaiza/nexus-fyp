require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/adapters/db/models/UserModel');

async function addJury() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const passwordHash = await bcrypt.hash('password123', 10);
    await User.deleteMany({ email: { $in: ['jury2@nu.edu.pk', 'jury3@nu.edu.pk'] } });
    await User.insertMany([
      { name: 'Dr. Second Jury', email: 'jury2@nu.edu.pk', password: passwordHash, role: 'jury', department: 'CS', isApproved: true },
      { name: 'Dr. Third Jury', email: 'jury3@nu.edu.pk', password: passwordHash, role: 'jury', department: 'AI', isApproved: true },
    ]);
    console.log('Successfully added 2 more jury members!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
addJury();
