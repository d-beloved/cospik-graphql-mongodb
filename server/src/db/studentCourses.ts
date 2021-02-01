import studentTable from "./students"

const studentCourse = `
  DROP TABLE IF EXISTS student_courses;
  CREATE TABLE student_courses (
    student_id uuid REFERENCES students(student_id) ON UPDATE CASCADE ON DELETE CASCADE,
    course_id uuid REFERENCES courses(course_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT student_course_id PRIMARY KEY (student_id, course_id)
  );
`

export default studentCourse;
