import { Pool } from 'pg';
import { connectionString } from '../db/dbConfig';

const pool = new Pool(connectionString);

const ifAdminExists = (req, res, next) => {
  const username: String = req.body.username.trim().toLowerCase();
  const checkAdmin = `SELECT * FROM admin
                      WHERE username = $1`;
  pool.connect()
    .then((client) => {
      client.query({
        text: checkAdmin,
        values: [username]
      })
        .then((foundMatch) => {
          client.release();
          if (!foundMatch.rows[0]) {
            return next();
          }
          return res.status(409).json({
            message: 'Username already registered',
            success: false
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

export default ifAdminExists;
