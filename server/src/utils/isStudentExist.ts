import { Pool } from 'pg';
import { connectionString } from '../db/dbConfig';

const pool = new Pool(connectionString);

const ifStudentExists = (req, res, next) => {
  const email: String = req.body.email.trim().toLowerCase();
  const checkStudent = `SELECT * FROM students
                      WHERE email = $1`;
  pool.connect()
    .then((client) => {
      client.query({
        text: checkStudent,
        values: [email]
      })
        .then((foundMatch) => {
          client.release();
          if (!foundMatch.rows[0]) {
            return next();
          }
          return res.status(409).json({
            message: 'Student with same email exists',
            success: false
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

export default ifStudentExists;
