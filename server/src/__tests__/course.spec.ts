import request from 'supertest';
import app from '../index';
import createToken from '../utils/tokenize';

const adminId = 'd0f7df8e-08b8-4950-a2d1-6fea9832ef84';
const courseId = 'ef8a13ad-1be1-4e31-a6f5-dc29ed836fd1';
const secretKey = process.env.JWT_SECRET;
const authToken = createToken({ username: 'admin', id: adminId }, secretKey);
const token = `Bearer ${authToken}`;

describe('Course', () => {
  afterEach(async (done) => {
    await app.close();
    done();
  })

  describe('Create a course', () => {
    it('Should return same course exist error', async () => {
      const res = await request(app)
        .post('/api/course')
        .set({ authorization: token })
        .send({
          course_name: 'Test Course',
        })
      expect(res.status).toEqual(409)
      expect(res.body.message).toEqual('Course already created')
    });
    it('Should return course created successfully', async () => {
      const res = await request(app)
        .post('/api/course')
        .set({ authorization: token })
        .send({
          course_name: 'New Course',
        })
      expect(res.status).toEqual(201)
      expect(res.body.message).toEqual('Course created successfully')
      expect(res.body).toHaveProperty('data')
    });
  });

  describe('Get courses', () => {
    it('should return all courses successfully', async () => {
      const res = await request(app)
        .get('/api/course')
        .set({ authorization: token })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('All Courses')
      expect(res.body).toHaveProperty('courses')
    });
  });

  describe('Delete a course', () => {
    it('Should delete a course successfully', async () => {
      const res = await request(app)
        .delete(`/api/course/${courseId}`)
        .set({ authorization: token })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('Course deleted successfully')
      expect(res.body).toHaveProperty('deleted')
    });
  });
});
