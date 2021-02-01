import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { connectionString } from './db/dbConfig';

export const adminPassword = bcrypt.hashSync('ispassword', 10);

const adminSql = `INSERT INTO admin (id, username, password)VALUES('d0f7df8e-08b8-4950-a2d1-6fea9832ef84', 'admin', '${adminPassword}')`;
const studentSql = `INSERT INTO students (student_id, firstname, lastname, email)VALUES('53d847d4-32df-4e68-b236-67e1137f7f35', 'firstOfThem', 'lastOneThere', 'myspecial@mail.com')`;
const course1Sql = `INSERT INTO courses (course_id, course_name)VALUES('e8138122-62da-4204-a586-dfeb8cb51e55', 'Test Course')`;
const course2Sql = `INSERT INTO courses (course_id, course_name)VALUES('a21f2901-fcd5-4255-bba8-fc0292840504', 'More Test Course')`;
const course3Sql = `INSERT INTO courses (course_id, course_name)VALUES('ef8a13ad-1be1-4e31-a6f5-dc29ed836fd1', 'Artificial intelligence')`;

const anotherStudentSql = `INSERT INTO students (student_id, firstname, lastname, email)VALUES('f8c7b139-f201-4151-9695-8805dbc4135f', 'nefwfwirst', 'letOneThn', 'miecioco@mail.com')`;
const newStudentSql = `INSERT INTO students (student_id, firstname, lastname, email)VALUES('ee33b587-1821-4a3d-9d7a-8774f462e51c', 'newfirst', 'lastOneThn', 'mispecioco@mail.com')`;
const enrollSql = `INSERT INTO student_courses (student_id, course_id)VALUES('ee33b587-1821-4a3d-9d7a-8774f462e51c', 'a21f2901-fcd5-4255-bba8-fc0292840504')`;

const queries = (query) => {
  const pool = new Pool(connectionString);
  ;(async () => {
    const client = await pool.connect();
    try {
      await client.query(query);
    } finally {
    client.release()
  }
  })().catch(err => console.log(err.stack))
};

queries(adminSql);
queries(studentSql);
queries(course1Sql);
queries(course3Sql);
queries(course2Sql);
queries(newStudentSql);
queries(anotherStudentSql);
queries(enrollSql);
