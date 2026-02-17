import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const checkAllUsers = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get ALL users including unverified
    const allUsers = await User.find({});
    console.log(`📊 Total users (including unverified): ${allUsers.length}\n`);

    if (allUsers.length === 0) {
      console.log('⚠️  No users found in database!');
    } else {
      console.log('All Users:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.accountStatus}`);
        console.log(`   Email Verified: ${user.isEmailVerified}`);
        console.log(`   Has OTP: ${user.otp ? 'Yes' : 'No'}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    }

    // Check verified vs unverified
    const verified = await User.countDocuments({ isEmailVerified: true });
    const unverified = await User.countDocuments({ isEmailVerified: false });
    
    console.log('Summary:');
    console.log(`✅ Verified users: ${verified}`);
    console.log(`⏳ Unverified users: ${unverified}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkAllUsers();
