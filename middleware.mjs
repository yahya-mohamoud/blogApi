import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;

        next()
    } catch (error) {
        console.log(error.message)
        res.status(403).json({ message: 'invalid or Expired token.' })
    }
}


export default authMiddleware
