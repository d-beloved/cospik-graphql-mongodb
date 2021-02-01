import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;


// Authenticates every action to be carried out on the app and
// checks the validity of the token
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send({ message: 'token is required!', success: false });
  } else {
    // checks if token matches the one provided at login
    const rightToken = token.split(' ')[1]; // Splits the token to reveal the user
    jwt.verify(rightToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Authentication failed! Token is Invalid or expired. Please Login again', success: false });
      } else {
        req.userData = decoded;
        next();
      }
    });
  }
};