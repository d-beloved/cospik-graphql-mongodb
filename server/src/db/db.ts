import { Pool } from 'pg';
import { connectionString } from './dbConfig';
import adminDB from './admin';
import studentDB from './students';
import courseDB from './courses';
import studentCourse from './studentCourses';

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

queries(`${adminDB}${studentDB}${courseDB}${studentCourse}`);
