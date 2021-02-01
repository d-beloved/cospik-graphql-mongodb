import { Pool } from 'pg';
import { connectionString } from './../db/dbConfig';

const pool = new Pool(connectionString);

class StudentController {

  static createStudent(req, res) {
    const firstname: String = req.body.firstname;
    const lastname: String = req.body.lastname;
    const email: String = req.body.email.toLowerCase();
    const studentQuery = `INSERT INTO students (firstname, lastname, email)
                          VALUES ($1, $2, $3)
                          RETURNING *`;

    pool.connect()
      .then((client) => {
        client.query({
          text: studentQuery,
          values: [
            firstname,
            lastname,
            email
          ]
        })
          .then((newStudent) => {
            client.release();
            res.status(201).send({
              message: 'Student created successfully',
              data: newStudent.rows[0],
              success: true
            });
          })
          .catch((err) => {
            client.release();
            throw(err);
          });
      });
  }

  static getAllStudents(req, res) {
    const getStudentsQuery = `SELECT * from students`;
    pool.connect()
      .then((client) => {
        client.query({
          text: getStudentsQuery
        })
        .then((allStudents) => {
          client.release();
          return res.status(200).send({
            message: 'All students',
            students: allStudents.rows
          });
        })
        .catch((err) => {
          client.release();
          console.log(err);
        });
      });
  }

  static getStudent(req, res) {
    const studentId = req.params.studentId;
    const getStudentQuery = `SELECT * from students
                              WHERE student_id::text = $1`;
    const getStudentCourse = `SELECT cos.course_id AS cos_id, cos.course_name AS cos_name
                                FROM student_courses stu_cos
                                JOIN courses cos ON (stu_cos.course_id = cos.course_id)
                                WHERE stu_cos.student_id = $1`;
    const enrollQuery = `UPDATE students
                                SET status = 'enrolled'
                                WHERE student_id::text = $1`;
    const unenrollQuery = `UPDATE students
                                SET status = 'not enrolled'
                                WHERE student_id::text = $1`;

    pool.connect()
      .then((client) => {
        client.query({
          text: getStudentQuery,
          values: [studentId]
        })
          .then((student) => {
            client.release();
            if (!student.rows[0]) {
              return res.status(404).send({
                message: 'Student not found!',
              });
            } else {
              pool.connect()
                .then((client) => {
                  client.query({
                    text: getStudentCourse,
                    values: [studentId]
                  })
                    .then((courses) => {
                      client.release();
                      if (courses.rows.length > 0 && student.rows[0].status === 'not enrolled') {
                        pool.connect()
                          .then((client) => {
                            client.query({
                              text: enrollQuery,
                              values: [studentId]
                            })
                              .then((status) => {
                                client.release();
                                return res.status(200).send({
                                  message: 'Student returned',
                                  student: student.rows[0],
                                  enrolled_courses: courses.rows
                                });
                              })
                          })
                      } else if (courses.rows.length === 0 && student.rows[0].status === 'enrolled') {
                        pool.connect()
                          .then((client) => {
                            client.query({
                              text: unenrollQuery,
                              values: [studentId]
                            })
                              .then((status) => {
                                client.release();
                                return res.status(200).send({
                                  message: 'Student returned',
                                  student: student.rows[0],
                                  enrolled_courses: courses.rows
                                });
                              })
                          })
                      } else {
                        return res.status(200).send({
                          message: 'Student returned',
                          student: student.rows[0],
                          enrolled_courses: courses.rows
                        });
                      }
                    })
                })
            }
          })
          .catch((err) => {
            client.release();
            console.log(err);
          });
      });
  }

  static updateStudent(req, res) {
    const studentId = req.params.studentId;
    const firstname: String = req.body.firstname;
    const lastname: String = req.body.lastname;
    const checkStudent = `SELECT * FROM students
                            WHERE student_id::text = $1`
    const updateStudentQuery = `UPDATE students
                                  SET firstname = $1, lastname = $2
                                  WHERE student_id::text = $3
                                  RETURNING *`;

    pool.connect()
      .then((client) => {
        client.query({
          text: checkStudent,
          values: [studentId]
        })
          .then((foundStudent) => {
            client.release();
            if (foundStudent) {
              pool.connect()
                .then((client) => {
                  client.query({
                    text: updateStudentQuery,
                    values: [
                      firstname || foundStudent.rows[0].firstname,
                      lastname || foundStudent.rows[0].lastname,
                      studentId
                    ]
                  })
                    .then((updatedStudent) => {
                      client.release();
                      return res.status(200).send({
                        message: 'Student name updated',
                        student: updatedStudent.rows[0],
                      });
                    })
                    .catch((err) => {
                      client.release();
                      console.log(err);
                    });
                });
            }
          })
      })
  }

  static enrollStudentForCourse(req, res) {
    // query to check if the student is enrolled for the course already
    const checkStudentCourse = `SELECT * FROM student_courses
                                  WHERE student_id::text = $1 AND course_id::text = $2`;

    const enrollQuery = `INSERT INTO student_courses (student_id, course_id)
                            VALUES ($1, $2)
                            RETURNING *`;

    pool.connect()
      .then((client) => {
        client.query({
          text: checkStudentCourse,
          values: [req.body.student_id, req.body.course_id]
        })
          .then((studentCourse) => {
            client.release();
            if(!studentCourse.rows[0]) {
              pool.connect()
                .then((client)=> {
                  client.query({
                    text: enrollQuery,
                    values: [req.body.student_id, req.body.course_id]
                  })
                    .then((enrolled) => {
                      client.release();
                      return res.status(200).send({
                        message: 'Student enrolled for course successfully',
                        enrolled: enrolled.rows[0],
                      });
                    })
                    .catch((err) => {
                      client.release();
                      console.log(err);
                    });
                });
            } else {
                return res.status(200).send({
                  message: 'Student is already enrolled for course'
                });
            }
          })
      })
  }

  static removeCourseForStudent(req, res) {
    const unenrollQuery = `DELETE FROM student_courses
                            WHERE student_id::text = $1 AND course_id::text = $2
                            RETURNING *`;

    pool.connect()
      .then((client)=> {
        client.query({
          text: unenrollQuery,
          values: [req.query.student_id, req.query.course_id]
        })
          .then((unenrolled) => {
            client.release();
            return res.status(200).send({
              message: 'Student unenrolled for course successfully',
              unenrolled: unenrolled.rows[0],
            });
          })
          .catch((err) => {
            client.release();
            console.log(err);
          });
      });
  }
}

export default StudentController;
