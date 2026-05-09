const mongoose = require('mongoose');
const User = require('./src/adapters/db/models/UserModel');

mongoose.connect('mongodb://127.0.0.1:27017/nexus-fyp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const result = await User.updateMany({}, { isApproved: true });
    console.log(result);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
