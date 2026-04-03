const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.currentUser = user;
    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

module.exports = adminMiddleware;