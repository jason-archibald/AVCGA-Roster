const jwt = require('jsonwebtoken');
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
        catch (e) { res.status(401).json({ message: 'Not authorized, token failed' }); }
    } else { res.status(401).json({ message: 'Not authorized, no token' }); }
};
module.exports = { protect };
