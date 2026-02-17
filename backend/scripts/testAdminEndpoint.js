import axios from 'axios';

const testAdminEndpoint = async () => {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@taskmanagement.com',
      password: 'Admin@123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 20) + '...\n');

    // Get all users
    console.log('📋 Fetching all users...');
    const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Users fetched successfully\n');
    console.log('Response:', JSON.stringify(usersResponse.data, null, 2));
    
    const users = usersResponse.data.data.users;
    console.log(`\n📊 Total users: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testAdminEndpoint();
