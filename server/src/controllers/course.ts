import { Pool } from 'pg';
import { connectionString } from './../db/dbConfig';

const pool = new Pool(connectionString);

class CourseController {

  static createCourse(req, res) {
    const courseName: String = req.body.course_name;
    const courseQuery = `INSERT INTO courses (course_name)
                          VALUES ($1)
                          RETURNING *`;

    pool.connect()
      .then((client) => {
        client.query({
          text: courseQuery,
          values: [courseName]
        })
          .then((newCourse) => {
            client.release();
            res.status(201).send({
              message: 'Course created successfully',
              data: newCourse.rows[0],
              success: true
            });
          })
          .catch((err) => {
            client.release();
            console.log(err);
          });
      });
  }

  static getAllCourses(req, res) {
    const getCoursesQuery = `SELECT * from courses`;
    pool.connect()
      .then((client) => {
        client.query({
          text: getCoursesQuery
        })
        .then((allCourses) => {
          client.release();
          return res.status(200).send({
            message: 'All Courses',
            courses: allCourses.rows
          });
        })
        .catch((err) => {
          client.release();
          console.log(err);
        });
      });
  }

  static deleteCourse(req, res) {
    const deleteCourseQuery = `DELETE FROM courses
                            WHERE course_id = $1
                            RETURNING *`;

    pool.connect()
      .then((client)=> {
        client.query({
          text: deleteCourseQuery,
          values: [req.params.courseId]
        })
          .then((deleted) => {
            client.release();
            return res.status(200).send({
              message: 'Course deleted successfully',
              deleted: deleted.rows[0]
            });
          })
          .catch((err) => {
            client.release();
            console.log(err);
          });
      });
  }
}

export default CourseController;
