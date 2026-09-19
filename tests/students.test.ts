import supertest from 'supertest';
import { createApp } from '../src/app';

const app = createApp(':memory:');
const request = supertest(app);

describe('Student Records API', () => {
  let createdId: number;

  it('15. GET /health - health check returns ok', async () => {
    const res = await request.get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('1. POST /api/students - create valid student (201)', async () => {
    const res = await request.post('/api/students').send({
      name: 'John Doe',
      rollNumber: 'CS101',
      department: 'CS',
      year: 2
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('John Doe');
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  it('2. POST /api/students - reject missing name (400)', async () => {
    const res = await request.post('/api/students').send({
      rollNumber: 'CS102',
      department: 'CS',
      year: 2
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('3. POST /api/students - reject missing rollNumber (400)', async () => {
    const res = await request.post('/api/students').send({
      name: 'Jane Doe',
      department: 'CS',
      year: 2
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('4. POST /api/students - reject invalid year (400)', async () => {
    const res = await request.post('/api/students').send({
      name: 'Jane Doe',
      rollNumber: 'CS102',
      department: 'CS',
      year: 5
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('5. POST /api/students - reject duplicate rollNumber (409)', async () => {
    const res = await request.post('/api/students').send({
      name: 'Jane Doe',
      rollNumber: 'CS101',
      department: 'CS',
      year: 2
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Duplicate roll number');
  });

  it('6. GET /api/students - list all students (200)', async () => {
    const res = await request.get('/api/students');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('7. GET /api/students?department=IT - filter by department', async () => {
    await request.post('/api/students').send({
      name: 'Alice',
      rollNumber: 'IT101',
      department: 'IT',
      year: 1
    });

    const res = await request.get('/api/students?department=IT');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].department).toBe('IT');
  });

  it('8. GET /api/students/:id - get existing student (200)', async () => {
    const res = await request.get(`/api/students/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it('9. GET /api/students/:id - return 404 for nonexistent', async () => {
    const res = await request.get('/api/students/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Student not found');
  });

  it('10. PUT /api/students/:id - update existing student (200)', async () => {
    const res = await request.put(`/api/students/${createdId}`).send({
      name: 'John Smith',
      year: 3
    });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Smith');
    expect(res.body.year).toBe(3);
  });

  it('11. PUT /api/students/:id - return 404 for nonexistent', async () => {
    const res = await request.put('/api/students/9999').send({
      name: 'Nobody'
    });
    expect(res.status).toBe(404);
  });

  it('12. PUT /api/students/:id - reject invalid data (400)', async () => {
    const res = await request.put(`/api/students/${createdId}`).send({
      year: 6
    });
    expect(res.status).toBe(400);
  });

  it('13. DELETE /api/students/:id - delete existing student (204)', async () => {
    const res = await request.delete(`/api/students/${createdId}`);
    expect(res.status).toBe(204);
  });

  it('14. DELETE /api/students/:id - return 404 for nonexistent', async () => {
    const res = await request.delete(`/api/students/${createdId}`);
    expect(res.status).toBe(404);
  });

  it('16. POST /api/students - reject malformed JSON (400)', async () => {
    const res = await request
      .post('/api/students')
      .set('Content-Type', 'application/json')
      .send('{"name": "Malformed", "rollNumber": "M1"'); // Missing closing brace

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});
