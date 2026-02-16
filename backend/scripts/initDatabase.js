import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Task from '../src/models/Task.js';

// Load environment variables
dotenv.config();

const initDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('✅ Data cleared');

    // Create admin user
    console.log('\n👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@taskmanagement.com',
      password: 'Admin@123',
      role: 'admin',
      isEmailVerified: true,
      accountStatus: 'active'
    });
    console.log('✅ Admin user created');
    console.log('   Email: admin@taskmanagement.com');
    console.log('   Password: Admin@123');

    // Create regular user
    console.log('\n👤 Creating regular user...');
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'User@123',
      role: 'user',
      isEmailVerified: true,
      accountStatus: 'active'
    });
    console.log('✅ Regular user created');
    console.log('   Email: john@example.com');
    console.log('   Password: User@123');

    // Create sample tasks
    console.log('\n📝 Creating sample tasks...');
    const tasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the task management system including API docs and user guide.',
        priority: 'high',
        status: 'in-progress',
        createdBy: admin._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Review code changes',
        description: 'Review pull requests and provide feedback on code quality and best practices.',
        priority: 'medium',
        status: 'pending',
        createdBy: admin._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment pipeline using GitHub Actions.',
        priority: 'urgent',
        status: 'pending',
        createdBy: user._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Database optimization',
        description: 'Analyze and optimize database queries for better performance.',
        priority: 'medium',
        status: 'completed',
        createdBy: user._id,
        completedAt: new Date()
      },
      {
        title: 'Security audit',
        description: 'Conduct comprehensive security audit and fix vulnerabilities.',
        priority: 'high',
        status: 'in-progress',
        createdBy: admin._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ];

    await Task.insertMany(tasks);
    console.log(`✅ ${tasks.length} sample tasks created`);

    console.log('\n✨ Database initialization completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Tasks: ${await Task.countDocuments()}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@taskmanagement.com / Admin@123');
    console.log('   User: john@example.com / User@123\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();
