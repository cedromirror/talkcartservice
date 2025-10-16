// Small helper script to create a test user in the project's MongoDB
// Usage: node scripts/createTestUser.js

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '..', 'backend', '.env') });

const mongoose = require('mongoose');
const config = require('../backend/config/config');
const User = require('../backend/models/User');
const jwt = require('jsonwebtoken');

(async () => {
  try {
    // Connect to DB
    const connectDB = require('../backend/config/database');
    await connectDB();

    const testEmail = 'test+dev@talkcart.local';
    const testUsername = 'test_dev_user';
    const testDisplay = 'Test Dev';
    const testPassword = process.env.TEST_PASSWORD;

    let user = await User.findOne({ $or: [{ email: testEmail }, { username: testUsername }] });
    if (user) {
      console.log('Test user already exists:', user.username, user.email);
    } else {
      user = new User({
        username: testUsername,
        displayName: testDisplay,
        email: testEmail,
        password: testPassword,
        avatar: '',
        bio: 'Automated test user',
        isVerified: true,
      });
      await user.save();
      console.log('Created test user:', user.username, user.email);
    }

    // Generate tokens using auth config
    const jwtConfig = require('../backend/config/config').jwt;
    const accessToken = jwt.sign({ userId: user._id }, jwtConfig.secret);
    const refreshToken = jwt.sign({ userId: user._id }, jwtConfig.refreshSecret);

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Test credentials:');
    console.log('  email:', testEmail);
    console.log('  username:', testUsername);
    console.log('  password:', testPassword);

    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
})();
