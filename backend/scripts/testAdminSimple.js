import https from 'https';
import http from 'http';

const makeRequest = (url, options, data = null) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

const test = async () => {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login
    const loginRes = await makeRequest('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'admin@taskmanagement.com',
      password: 'Admin@123'
    });

    if (loginRes.status !== 200) {
      console.error('❌ Login failed:', loginRes.data);
      return;
    }

    const token = loginRes.data.data.token;
    console.log('✅ Login successful\n');

    // Get users
    console.log('📋 Fetching users...');
    const usersRes = await makeRequest('http://localhost:5000/api/admin/users', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Status:', usersRes.status);
    console.log('Response:', JSON.stringify(usersRes.data, null, 2));

    if (usersRes.data.data && usersRes.data.data.users) {
      const users = usersRes.data.data.users;
      console.log(`\n📊 Total users: ${users.length}`);
      users.forEach((user, i) => {
        console.log(`${i + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

test();
