const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
exports.authMiddleware = (req, res, next) => {
  

  try {
    const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if the user is a seller
exports.sellerMiddleware = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied: Sellers only' });
  }
  next();
};

// Middleware to check if the user is a buyer
exports.buyerMiddleware = (req, res, next) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({ message: 'Access denied: Buyers only' });
  }
  next();
};
