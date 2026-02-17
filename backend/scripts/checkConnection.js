import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const checkConnection = async () => {
  try {
    console.log('🔍 Checking Database Connection...\n');
    
    // Show connection string (masked password)
    const uri = process.env.MONGODB_URI;
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log('📍 Connection String:', maskedUri);
    
    // Connect
    console.log('\n🔄 Connecting...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully\n');
    
    // Get connection details
    const connection = mongoose.connection;
    console.log('📊 Connection Details:');
    console.log('   Host:', connection.host);
    console.log('   Port:', connection.port);
    console.log('   Database Name:', connection.name);
    console.log('   Connection State:', connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // Check if it's Atlas or local
    if (connection.host.includes('mongodb.net')) {
      console.log('   Type: ☁️  MongoDB Atlas (Cloud)');
    } else if (connection.host === 'localhost' || connection.host === '127.0.0.1') {
      console.log('   Type: 💻 Local MongoDB');
    } else {
      console.log('   Type: 🌐 Remote MongoDB');
    }
    
    // Count users
    console.log('\n👥 Users in Database:');
    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ accountStatus: 'active' });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    
    console.log('   Total:', totalUsers);
    console.log('   Active:', activeUsers);
    console.log('   Verified:', verifiedUsers);
    
    // List all users
    if (totalUsers > 0) {
      console.log('\n📋 User List:');
      const users = await User.find({}).select('name email role accountStatus isEmailVerified');
      users.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.name} (${user.email})`);
        console.log(`      Role: ${user.role} | Status: ${user.accountStatus} | Verified: ${user.isEmailVerified}`);
      });
    }
    
    console.log('\n✅ Check complete!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

checkConnection();
