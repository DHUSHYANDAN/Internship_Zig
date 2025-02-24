// Middleware to check if the user is an Admin or Manager
const authorizeAdminOrManager = (req, res, next) => {
    if (req.user.job_role === 'Admin' || req.user.job_role === 'Manager') {
        next(); // Proceed to the route handler
    } else {
        return res.status(403).json({ message: 'Access denied. Only Admins and Managers can perform this action.' });
    }
};
module.exports =  authorizeAdminOrManager; 