const courseTable = `
  DROP TABLE IF EXISTS courses CASCADE;

  CREATE TABLE courses (
    course_id uuid DEFAULT uuid_generate_v4 (),
    course_name VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (course_id)
  );
`;

export default courseTable;
