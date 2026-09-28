// Middleware is a function that runs before the actual route handler.
// This auth middleware checks if the user has an active session before allowing access to protected routes.
const authMiddleware = (req, res, next) => {
    // Check if the session and userId exist
    if (req.session && req.session.userId) {
        // Attach the userId to the request object for easy access in route handlers
        req.userId = req.session.userId;
        // Call next() to pass control to the next middleware or route handler
        next();
    } else {
        // If not authenticated, return a 401 Unauthorized response
        return res.status(401).json({ success: false, error: 'Not authenticated. Please log in.' });
    }
};

module.exports = authMiddleware;
