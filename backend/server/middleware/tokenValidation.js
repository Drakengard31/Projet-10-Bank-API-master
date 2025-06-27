const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 401,
      message: 'Authorization token missing or invalid'
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
      token,
      process.env.SECRET_KEY || 'default-secret-key',
      (err, decoded) => {
        if (err) {
          return res.status(403).json({
            status: 403,
            message: 'Invalid or expired token'
          });
        }
        req.userId = decoded.id;
        next();
      }
  );
};