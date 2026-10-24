import http from 'http';

const BASE_URL = 'http://localhost:5000';

async function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Complete Backend API & Frontend Integration Tests ---');
  let createdId = null;

  // 1. GET /api/employees
  console.log('\n[TEST 1] GET /api/employees');
  const getInitial = await request('GET', '/api/employees');
  console.log(`Status: ${getInitial.status}`, Array.isArray(getInitial.data) ? `Found ${getInitial.data.length} employees` : 'FAILED');

  // 2. POST /api/employees (Valid)
  console.log('\n[TEST 2] POST /api/employees (Valid)');
  const newEmp = {
    name: 'Sereena Mechery',
    designation: 'Full Stack Developer',
    location: 'Kerala, India',
    salary: 85000,
  };
  const postRes = await request('POST', '/api/employees', newEmp);
  console.log(`Status: ${postRes.status}`, postRes.data);
  if (postRes.status === 201 && postRes.data._id) {
    createdId = postRes.data._id;
    console.log('Created Employee ID:', createdId);
  } else {
    throw new Error('POST failed to create employee');
  }

  // 3. POST /api/employees (Invalid - Missing salary & short name)
  console.log('\n[TEST 3] POST /api/employees (Validation Failure)');
  const invalidEmp = { name: 'A', designation: '' };
  const postInvalid = await request('POST', '/api/employees', invalidEmp);
  console.log(`Status: ${postInvalid.status}`, postInvalid.data);

  // 4. GET /api/employees/:id (Valid ID)
  console.log('\n[TEST 4] GET /api/employees/:id (Valid)');
  const getSingle = await request('GET', `/api/employees/${createdId}`);
  console.log(`Status: ${getSingle.status}`, getSingle.data);

  // 5. GET /api/employees/:id (Invalid format ID)
  console.log('\n[TEST 5] GET /api/employees/:id (Invalid Format)');
  const getBadFormat = await request('GET', '/api/employees/123-not-an-objectid');
  console.log(`Status: ${getBadFormat.status}`, getBadFormat.data);

  // 6. GET /api/employees/:id (Non-existent ID)
  console.log('\n[TEST 6] GET /api/employees/:id (Non-existent)');
  const getNotFound = await request('GET', '/api/employees/507f1f77bcf86cd799439011');
  console.log(`Status: ${getNotFound.status}`, getNotFound.data);

  // 7. PUT /api/employees/:id (Update)
  console.log('\n[TEST 7] PUT /api/employees/:id (Update)');
  const updateRes = await request('PUT', `/api/employees/${createdId}`, {
    designation: 'Senior Full Stack Lead',
    salary: 110000,
  });
  console.log(`Status: ${updateRes.status}`, updateRes.data);

  // 8. PUT /api/employees/:id (Invalid negative salary)
  console.log('\n[TEST 8] PUT /api/employees/:id (Invalid Negative Salary)');
  const updateInvalid = await request('PUT', `/api/employees/${createdId}`, {
    salary: -500,
  });
  console.log(`Status: ${updateInvalid.status}`, updateInvalid.data);

  // 9. DELETE /api/employees/:id (Delete)
  console.log('\n[TEST 9] DELETE /api/employees/:id (Delete)');
  const deleteRes = await request('DELETE', `/api/employees/${createdId}`);
  console.log(`Status: ${deleteRes.status}`, deleteRes.data);

  // 10. DELETE /api/employees/:id (Already deleted / Not Found)
  console.log('\n[TEST 10] DELETE /api/employees/:id (Already Deleted)');
  const deleteNotFound = await request('DELETE', `/api/employees/${createdId}`);
  console.log(`Status: ${deleteNotFound.status}`, deleteNotFound.data);

  // 11. GET / (Frontend SPA index.html verification)
  console.log('\n[TEST 11] GET / (Serve Frontend index.html)');
  const frontendIndex = await request('GET', '/');
  console.log(`Status: ${frontendIndex.status}`, typeof frontendIndex.text === 'string' && frontendIndex.text.includes('<div id="root">') ? 'SUCCESS (Frontend served)' : 'FAILED');

  // 12. GET /employee-form (Frontend SPA route fallback verification)
  console.log('\n[TEST 12] GET /employee-form (Serve Frontend SPA Fallback)');
  const frontendForm = await request('GET', '/employee-form');
  console.log(`Status: ${frontendForm.status}`, typeof frontendForm.text === 'string' && frontendForm.text.includes('<div id="root">') ? 'SUCCESS (SPA Fallback served)' : 'FAILED');

  console.log('\n--- ALL TESTS COMPLETED SUCCESSFULLY! ---');
  process.exit(0);
}

// Check if app is already running or import it
try {
  await import('./app.js');
  setTimeout(runTests, 2500);
} catch (err) {
  console.error('Failed to start server for test:', err);
  process.exit(1);
}
