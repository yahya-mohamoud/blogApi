import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma.js";
import jwt from "jsonwebtoken"
import { generateToken } from "../utils/jwt.js";

export const userLogin = async (req, res) => {
    const { username, password } = req.body
    const user = await prisma.user.findUnique({
        where: { username }
    })

    if (!user) return res.status(404).json({ message: `user with ${username} wasn't found` })

    const ismatch = await bcrypt.compare(password, user.password)

    if (!ismatch) return res.status(401).json({ message: "invalid credentials" })

    const { accessToken, refreshToken } = generateToken(user)

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken }
    })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 15 * 60 * 1000
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        credentials: "include",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
        message: "login successful",
        user
    })
}

export const adminLogin = async (req, res) => {
    const { username, password } = req.body
    const user = await prisma.user.findUnique({
        where: { username }
    })

    if (!user) res.status(404).json({ message: `user with ${username} wasn't found` })

    const ismatch = await bcrypt.compare(password, user.password)

    if (user.roles === "USER") {
        res.status(401).json({ message: "user is not allowed here" })
    } else {

        if (!ismatch) res.status(401).json({ message: "invalid credentials" })

        const { accessToken, refreshToken } = generateToken(user)

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 15 * 60 * 1000
        })

        res.json({
            message: "login successful",
            token: accessToken,
            user
        })

    }
}

export const createAdmin = async (req, res) => {
    const { username, email, password } = req.body;
    const checkEmailANDusername = await prisma.user.findFirst({
        where: {
            AND: [
                { email },
                { username }
            ],
        }
    })
    if (checkEmailANDusername) return res.status(403).json({ message: "email and username already exists, please choose another email and username" })

    const checkEmailOnly = await prisma.user.findUnique({
        where: { email }
    })

    if (checkEmailOnly) return res.status(303).json({ message: 'This email already exists' })

    const checkUsername = await prisma.user.findUnique({
        where: { username }
    })

    if (checkUsername) {
        return res.status(303).json({ message: 'This username already exists' })

    }


    const hashed = await bcrypt.hash(password, 10)

    const admin = await prisma.user.create({
        data: {
            username,
            password: hashed,
            email,
            roles: "ADMIN"
        }
    })

    res.json(admin)
}

export const registerUser = async (req, res) => {
    const { username, email, password, confirm } = req.body;

    if (password !== confirm) {
        res.status(401).json({ message: "passwords must be the same" })
        return
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashed
        }
    })
    res.json({ user })
}

export const refreshRoute = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refreshToken provided' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await prisma.user.findFirst({
            where: { id: decoded.id }
        })

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "invalid refresh token" });
        }

        const { refreshToken, accessToken } = generateToken(user)
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken }
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ accessToken: accessToken })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: "invalid or expired refresh refreshToken" })
    }
}

export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);
    await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null }
    })

    res.clearCookie('refreshToken', { path: '/refresh' });
    res.sendStatus(200).json({ message: "Logged out successfully" })
}