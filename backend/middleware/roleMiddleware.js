// This middleware is a "higher-order function". You call it with the roles
// you want to allow, and it returns a new middleware function that Express can use.
// Example: authorize('SuperAdmin', 'SquadronCommander')
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is attached by the 'protect' middleware which MUST run before this one.
        if (!req.user || !req.user.role) {
            // This case should not happen if 'protect' middleware is used correctly.
            return res.status(401).json({ message: 'Not authorized, user role not found on token' });
        }

        const rolesArray = [...allowedRoles];
        const hasPermission = rolesArray.includes(req.user.role);

        if (!hasPermission) {
            // User is authenticated but does not have the correct role for this specific action.
            return res.status(403).json({ message: `Access Denied: Your role ('${req.user.role}') is not authorized for this resource.` });
        }
        
        // If the user's role is in the list of allowed roles, proceed to the next middleware or controller.
        next();
    };
};

module.exports = { authorize };
