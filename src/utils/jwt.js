import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

export const generateAccessToken = (userId, username, email) => {
    return jwt.sign({id: userId, user: username, email: email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m'})
}
export const generateRefreshToken = (userId) => {
    return jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d'})
}


