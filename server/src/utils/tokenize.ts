import jwt from 'jsonwebtoken';

// creates the authentication token for an admin

const token = (admin: Object, secretKey: string) => {
  const authToken = jwt.sign(
    admin, secretKey,
    { expiresIn: '1h'},
  );

  return authToken;
}

export default token;
