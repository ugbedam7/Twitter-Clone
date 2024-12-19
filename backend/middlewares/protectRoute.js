import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import logger from '../lib/utils/logger.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized, no token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        Error: 'Unauthorized: Invalid token'
      });
    }

    const user = await User.findById(decoded.userId).select('-password');
    req.user = user;

    next();
  } catch (err) {
    logger.error(`Error in proctedRoute middleware: ${err.message}`);
    res.status(500).json({
      Error: `Internal server error: ${err.message}`
    });
  }
};
