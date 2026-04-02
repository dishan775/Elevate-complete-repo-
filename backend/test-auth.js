const axios = require('axios');
const fs = require('fs');

async function testAuth() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    });
    fs.writeFileSync('test-result.json', JSON.stringify({ success: res.data }));
  } catch (err) {
    fs.writeFileSync('test-result.json', JSON.stringify({ error: err.response ? err.response.data : err.message }));
  }
}

testAuth();
