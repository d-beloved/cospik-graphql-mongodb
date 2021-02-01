import { Pool } from 'pg';
import { connectionString } from '../db/dbConfig';

const pool = new Pool(connectionString);

const ifCourseExists = (req, res, next) => {
  const courseName: String = req.body.course_name.trim();
  const checkCourse = `SELECT * FROM courses
                      WHERE course_name = $1`;
  pool.connect()
    .then((client) => {
      client.query({
        text: checkCourse,
        values: [courseName]
      })
        .then((foundMatch) => {
          client.release();
          if (!foundMatch.rows[0]) {
            return next();
          }
          return res.status(409).json({
            message: 'Course already created',
            success: false
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

export default ifCourseExists;
