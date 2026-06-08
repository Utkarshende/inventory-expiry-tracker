// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes from unauthorized public users
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header: "Bearer <token_string>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB without password field and append to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorised, user not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorised, token verification failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorised, no authentication token provided' });
  }
};

// Middleware to restrict routes strictly to Store Managers
export const authorizeManager = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Requires Manager privileges' });
  }
};
