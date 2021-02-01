import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import createToken from '../utils/tokenize';
import { connectionString } from './../db/dbConfig';

const pool = new Pool(connectionString);

const secretKey = process.env.JWT_SECRET;

class AdminController {

  // create an Admin
  static createAdmin(req, res) {
    // checks the length of the password and its validity
    const pswd: string = req.body.password;
    if (pswd.length < 6) {
      return res.status(406).send({
        message: 'passwords cannot be less than 6 characters',
        success: false
      });
    };

    // Hash the password before saving it in the db
    const hashedPassword: string = bcrypt.hashSync(pswd, 10);
    const username: string = req.body.username.toLowerCase();
    const adminQuery = `INSERT INTO admin (username, password)
                          VALUES ($1, $2)
                          RETURNING *`;

    pool.connect()
      .then((client) => {
        client.query({
          text: adminQuery,
          values: [username, hashedPassword]
        })
          .then((createdAdmin) => {
            client.release();
            const newAdmin = createdAdmin.rows[0];
            // create the token after all the inputs are certified ok
            const { username, id } = newAdmin;
            const authToken = createToken({ username, id }, secretKey);
            const { password, ...rest } = newAdmin;
            res.status(201).json({
              message: 'Admin created successfully',
              user: rest,
              token: authToken,
              success: true
            });
          })
          .catch((err) => {
            client.release();
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Admin login to the app
  static adminLogin(req, res) {
    const username = req.body.username.toLowerCase();
    const findAnAdmin = `SELECT * FROM admin
                          WHERE username = $1`;

    pool.connect()
      .then((client) => {
        client.query({
          text: findAnAdmin,
          values: [username]
        })
          .then((admin) => {
            client.release();
            if (admin.rows[0]) {
              // check if the password is correct
              const authAdmin = admin.rows[0];
              bcrypt.compare(req.body.password, authAdmin.password).then((check) => {
                if (!check) { // If the password does not match
                  res.status(401).send({ message: 'Wrong username or password!', success: false });
                } else {
                  // creates a token
                  const { username, id } = authAdmin;
                  const authToken = createToken({ username, id }, secretKey);
                  const { password, ...rest } = authAdmin;
                  res.status(200).send({
                    message: 'You are logged in!',
                    authToken,
                    user: rest,
                    success: true
                  });
                }
              })
                .catch((err) => {
                  if (err) {
                    res.status(400).send({ message: 'An error occurred', success: false, err });
                  }
                });
            } else {
              res.status(404).json({
                message: 'Wrong username or password!',
                success: false,
              });
            }
          })
          .catch((err) => {
            client.release();
            console.log(err);
          });
      });
  }
}

export default AdminController;
