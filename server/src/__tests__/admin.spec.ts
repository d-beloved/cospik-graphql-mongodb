import request from 'supertest';
import app from '../index';

describe('Auth', () => {
  afterEach(async (done) => {
    await app.close();
    done();
  })

  describe('Create an Admin', () => {
    it('should return content missing error', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'newAdmin'
        })
      expect(res.status).toEqual(400)
      expect(res.body.message).toEqual('password cannot be missing in the body!')
    });
    it('should throw error if admin with same username exists', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'admin',
          password: 'isadmin'
        })
      expect(res.status).toEqual(409)
      expect(res.body.message).toEqual('Username already registered')
    });
    it('should throw password length error if password is less than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'adminer',
          password: 'isadm'
        })
      expect(res.status).toEqual(406)
      expect(res.body.message).toEqual('passwords cannot be less than 6 characters')
    });
    it('should sign the admin up successfully', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: '   newAdmin',
          password: 'isadmin'
        })
      expect(res.status).toEqual(201)
      expect(res.body.message).toEqual('Admin created successfully')
      expect(res.body).toHaveProperty('token')
      expect(res.body.user.username).toEqual('newadmin')
    });
  });

  describe('Admin Login', () => {
    it('should return content missing error', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'ispassword'
        })
      expect(res.status).toEqual(400)
      expect(res.body.message).toEqual('username cannot be missing in the body!')
    });
    it('should return wrong username or password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'ispassord'
        })
      expect(res.status).toEqual(401)
      expect(res.body.message).toEqual('Wrong username or password!')
    });
    it('should return wrong username or password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admit',
          password: 'ispassword'
        })
      expect(res.status).toEqual(404)
      expect(res.body.message).toEqual('Wrong username or password!')
    });
    it('should sign the admin in successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: '   admin',
          password: 'ispassword'
        })
      expect(res.status).toEqual(200)
      expect(res.body.message).toEqual('You are logged in!')
      expect(res.body).toHaveProperty('authToken')
      expect(res.body.user.username).toEqual('admin')
    });
  });
});
