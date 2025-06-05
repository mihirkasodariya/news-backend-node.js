const jwt = require('jsonwebtoken');

module.exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.headers.Authorization;

        if (!token) {
            return res.status(401).json({ status: 401, message: 'No token provided!' });
        };
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
console.log('decoded', decoded)
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ status: 401, message: 'Invalid or expired token', error: err.message });
    };
};
