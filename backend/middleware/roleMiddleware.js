const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Access denied - insufficient permissions' 
            });
        }
        
        next();
    };
};

module.exports = { authorize };
