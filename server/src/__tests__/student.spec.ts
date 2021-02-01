import request from 'supertest';
import app from '../index';
import createToken from '../utils/tokenize';

const adminId = 'd0f7df8e-08b8-4950-a2d1-6fea9832ef84';
const studentId = '53d847d4-32df-4e68-b236-67e1137f7f35';
const newstudentId = 'ee33b587-1821-4a3d-9d7a-8774f462e51c';
const anotherStudentId = 'f8c7b139-f201-4151-9695-8805dbc4135f';
const wrongStudentId = '33d847d4-32df-4e68-b236-67e1137f7fre';
const courseId = 'e8138122-62da-4204-a586-dfeb8cb51e55';
const newCourseId = 'a21f2901-fcd5-4255-bba8-fc0292840504';
const secretKey = process.env.JWT_SECRET;
const wrongtoken = 'wrongsecret';
const authToken = createToken({ username: 'admin', id: adminId }, secretKey);
const token = `Bearer ${authToken}`;

describe('Student', () => {
  afterEach(async (done) => {
    await app.close();
    done();
  })

  describe('Create a student', () => {
    it('should return auth required error', async () => {
      const res = await request(app)
        .post('/api/student')
        .send({
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'lasfes@mail.com'
        })
      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual('token is required!')
    });
    it('should return token invalid error', async () => {
      const res = await request(app)
        .post('/api/student')
        .set({ authorization: wrongtoken })
        .send({
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'lasfes@mail.com'
        })
      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual('Authentication failed! Token is Invalid or expired. Please Login again')
    });
    it('should return content error', async () => {
      const res = await request(app)
        .post('/api/student')
        .set({ authorization: token })
        .send({
          lastname: 'lastname',
          email: 'lasfes@mail.com'
        })
      expect(res.status).toEqual(400)
      expect(res.body.message).toEqual('firstname cannot be missing in the body!')
    });
    it('should return email invalid error', async () => {
      const res = await request(app)
        .post('/api/student')
        .set({ authorization: token })
        .send({
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'lasfesmail.come'
        })
      expect(res.status).toEqual(406)
      expect(res.body.message).toEqual('Please enter a valid email')
    });
    it('should return same student exist error', async () => {
      const res = await request(app)
        .post('/api/student')
        .set({ authorization: token })
        .send({
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'myspecial@mail.com'
        })
      expect(res.status).toEqual(409)
      expect(res.body.message).toEqual('Student with same email exists')
    });
    it('should return student created successfully', async () => {
      const res = await request(app)
        .post('/api/student')
        .set({ authorization: token })
        .send({
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'lasfes@mail.com'
        })
      expect(res.status).toEqual(201)
      expect(res.body.message).toEqual('Student created successfully')
      expect(res.body).toHaveProperty('data')
    });
  });

  describe('Get students', () => {
    it('should return auth required error', async () => {
      const res = await request(app)
        .get('/api/student')
      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual('token is required!')
    });
    it('should return token invalid error', async () => {
      const res = await request(app)
        .get('/api/student')
        .set({ authorization: wrongtoken })
      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual('Authentication failed! Token is Invalid or expired. Please Login again')
    });
    it('should return all student successfully', async () => {
      const res = await request(app)
        .get('/api/student')
        .set({ authorization: token })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('All students')
      expect(res.body).toHaveProperty('students')
    });
  });

  describe('Get one student', () => {
    it('should return auth required error', async () => {
      const res = await request(app)
        .get(`/api/student/${studentId}`)
      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual('token is required!')
    });
    it('should return token invalid error', async () => {
      const res = await request(app)
        .get(`/api/student/${studentId}`)
        .set({ authorization: wrongtoken })
      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual('Authentication failed! Token is Invalid or expired. Please Login again')
    });
    it('should return student not found error', async () => {
      const res = await request(app)
        .get(`/api/student/${wrongStudentId}`)
        .set({ authorization: token })
      expect(res.status).toEqual(404)
      expect(res.body.message).toEqual('Student not found!')
    });
    it('should return student successfully', async () => {
      const res = await request(app)
        .get(`/api/student/${studentId}`)
        .set({ authorization: token })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('Student returned')
      expect(res.body).toHaveProperty('student')
      expect(res.body).toHaveProperty('enrolled_courses')
    });
    it('should return student\'s correct status', async () => {
      const res = await request(app)
        .get(`/api/student/${studentId}`)
        .set({ authorization: token })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('Student returned')
      expect(res.body.enrolled_courses).toHaveLength(0)
      expect(res.body.student.status).toBe('not enrolled')
    });
  });

  describe('Update a student', () => {
    it('should update student name successfully', async () => {
      const res = await request(app)
        .put(`/api/student/${studentId}`)
        .set({ authorization: token })
        .send({
          firstname: 'firstOfThee',
          lastname: 'lastAndThee',
        })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('Student name updated')
      expect(res.body).toHaveProperty('student')
      expect(res.body.student.firstname).toEqual('firstOfThee')
      expect(res.body.student.lastname).toEqual('lastAndThee')
    });
  });

  describe('Enroll a student for a course', () => {
    it('should enroll student for course successfully', async () => {
      const res = await request(app)
        .post('/api/student/enroll')
        .set({ authorization: token })
        .send({
          student_id: `${anotherStudentId}`,
          course_id: `${courseId}`,
        })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('Student enrolled for course successfully')
      expect(res.body).toHaveProperty('enrolled')
    });
    it('should return a duplicate exist message', async () => {
      const res = await request(app)
        .post('/api/student/enroll')
        .set({ authorization: token })
        .send({
          student_id: `${anotherStudentId}`,
          course_id: `${courseId}`,
        })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('Student is already enrolled for course')
    });
  });

  describe('Unenroll a student from a course', () => {
    it('should enroll student for course successfully', async () => {
      const res = await request(app)
        .delete(`/api/student/unenroll?student_id=${newstudentId}&course_id=${newCourseId}`)
        .set({ authorization: token })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('Student unenrolled for course successfully')
      expect(res.body).toHaveProperty('unenrolled')
    });
  });
});
