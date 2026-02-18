const http = require('http');

const BASE_URL = 'http://localhost:3001';
let createdTodoId = null;

// Helper function for making HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test cases
const tests = [
  {
    name: 'Health Check',
    run: async () => {
      const res = await makeRequest('GET', '/health');
      console.assert(res.status === 200, 'Health check should return 200');
      console.assert(res.data.success === true, 'Health check should be successful');
      return res;
    },
  },
  {
    name: 'Create Todo - Valid',
    run: async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo item',
        priority: 'high',
        due_date: '2026-12-31T23:59:59Z',
      };
      const res = await makeRequest('POST', '/api/todos', todoData);
      console.assert(res.status === 201, 'Create should return 201');
      console.assert(res.data.success === true, 'Create should be successful');
      console.assert(res.data.data.title === todoData.title, 'Title should match');
      createdTodoId = res.data.data.id;
      return res;
    },
  },
  {
    name: 'Create Todo - Invalid (missing title)',
    run: async () => {
      const res = await makeRequest('POST', '/api/todos', { description: 'No title' });
      console.assert(res.status === 400, 'Should return 400 for validation error');
      console.assert(res.data.success === false, 'Should not be successful');
      return res;
    },
  },
  {
    name: 'Create Todo - Invalid status',
    run: async () => {
      const res = await makeRequest('POST', '/api/todos', {
        title: 'Test',
        status: 'invalid_status',
      });
      console.assert(res.status === 400, 'Should return 400 for invalid status');
      return res;
    },
  },
  {
    name: 'Get All Todos',
    run: async () => {
      const res = await makeRequest('GET', '/api/todos');
      console.assert(res.status === 200, 'Get all should return 200');
      console.assert(Array.isArray(res.data.data), 'Should return array of todos');
      console.assert(res.data.pagination !== undefined, 'Should include pagination');
      return res;
    },
  },
  {
    name: 'Get Todo by ID',
    run: async () => {
      const res = await makeRequest('GET', `/api/todos/${createdTodoId}`);
      console.assert(res.status === 200, 'Get by ID should return 200');
      console.assert(res.data.data.id === createdTodoId, 'Should return correct todo');
      return res;
    },
  },
  {
    name: 'Get Todo by Invalid ID',
    run: async () => {
      const res = await makeRequest('GET', '/api/todos/99999');
      console.assert(res.status === 404, 'Should return 404 for non-existent todo');
      return res;
    },
  },
  {
    name: 'Update Todo - Full',
    run: async () => {
      const updateData = {
        title: 'Updated Todo',
        description: 'Updated description',
        status: 'completed',
        priority: 'low',
      };
      const res = await makeRequest('PUT', `/api/todos/${createdTodoId}`, updateData);
      console.assert(res.status === 200, 'Update should return 200');
      console.assert(res.data.data.title === updateData.title, 'Title should be updated');
      console.assert(res.data.data.status === updateData.status, 'Status should be updated');
      return res;
    },
  },
  {
    name: 'Update Todo - Partial (PATCH)',
    run: async () => {
      const res = await makeRequest('PATCH', `/api/todos/${createdTodoId}`, {
        status: 'in_progress',
      });
      console.assert(res.status === 200, 'Patch should return 200');
      console.assert(res.data.data.status === 'in_progress', 'Status should be updated');
      return res;
    },
  },
  {
    name: 'Filter by Status',
    run: async () => {
      const res = await makeRequest('GET', '/api/todos?status=in_progress');
      console.assert(res.status === 200, 'Filter should return 200');
      console.assert(Array.isArray(res.data.data), 'Should return array');
      return res;
    },
  },
  {
    name: 'Get Statistics',
    run: async () => {
      const res = await makeRequest('GET', '/api/todos/stats');
      console.assert(res.status === 200, 'Stats should return 200');
      console.assert(res.data.data.total !== undefined, 'Should include total count');
      return res;
    },
  },
  {
    name: 'Delete Todo',
    run: async () => {
      const res = await makeRequest('DELETE', `/api/todos/${createdTodoId}`);
      console.assert(res.status === 200, 'Delete should return 200');
      console.assert(res.data.success === true, 'Delete should be successful');
      return res;
    },
  },
  {
    name: 'Verify Deletion',
    run: async () => {
      const res = await makeRequest('GET', `/api/todos/${createdTodoId}`);
      console.assert(res.status === 404, 'Deleted todo should not be found');
      return res;
    },
  },
];

// Run all tests
async function runTests() {
  console.log('\n🧪 Starting API Tests...\n');
  
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Running: ${test.name}`);
      const result = await test.run();
      console.log(`✅ PASSED: ${test.name}`);
      console.log(`   Status: ${result.status}`);
      passed++;
    } catch (error) {
      console.log(`❌ FAILED: ${test.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log('═'.repeat(50));
  console.log(`\nTest Results: ${passed} passed, ${failed} failed\n`);
  
  process.exit(failed > 0 ? 1 : 0);
}

// Wait for server to be ready
setTimeout(() => {
  makeRequest('GET', '/health')
    .then(() => runTests())
    .catch(() => {
      console.error('❌ Server is not running. Please start it with: npm start');
      process.exit(1);
    });
}, 1000);
