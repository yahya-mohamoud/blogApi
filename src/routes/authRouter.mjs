import dotenv from "dotenv"
dotenv.config()
import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../prisma.mjs";
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js'

const auth = Router()

auth.get('/', (req, res) => {
    res.json('hi this is auth entry')
})

auth.post('/login', async (req, res) => {
    const { username, password } = req.body
    console.log(username)
    const user = await prisma.user.findUnique({
        where: { username }
    })

    if (!user) res.status(404).json({ message: `user with ${username} wasn't found` })

    const ismatch = await bcrypt.compare(password, user.password)

    if (!ismatch) res.status(401).json({ message: "invalid credentials" })


    const token = generateAccessToken(user.id, user.username, user.email, user.roles)


    res.json({
        message: "login successful",
        token,
        user
    })
})

auth.post("/createadmin", async (req, res) => {
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
    
    const checkEmailOnly =  await prisma.user.findUnique({
        where: {email}
    })

    if(checkEmailOnly) return res.status(303).json({message: 'This email already exists'})

    const checkUsername =  await prisma.user.findUnique({
        where: {username}
    })

    if(checkUsername) {
        console.log("username", username)
        return res.status(303).json({message: 'This username already exists'})

    }

    console.log(checkEmailANDusername)

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
})

auth.post('/signup', async (req, res) => {
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
})

auth.post("/confirm", async (req, res) => {
    const { email } = req.body;

    const userEmail = await prisma.user.findFirst({
        where: { email }
    })

    if (!userEmail) {
        res.status(404).json({ message: "unknown email, please try again", result: 0 })
    } else {
        res.json({ email, result: 1 })

    }

})

// auth.post("/reset", async (req, res) => {
//     const {username, password, confirm} = req.body;

//     if(password !== confirm) {
//         res.status(401).json({message: "Passwords do not match"})
//     }
//     const user = await prisma.user.findFirst({
//         where: { username}
//     })

//     if(!user) {
//         res.status(402).json({message: "user not found!!!!"})
//     }

//     const hash = await bcrypt.hash(password, 10)
//     console.log(hash)
//     await prisma.user.update({
//         where: {
//             id: user.id
//         },
//         data: {
//             email: user.email,

//             password: hash
//         }
//     })

//     res.json("user exists")


// })

auth.post('/refresh', async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ message: 'No token provided' })

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        })

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "invalid refresh token" });
        }

        const newRefreshToken = generateRefreshToken(user.id)
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        })

        const newAccessToken = generateAccessToken(user.id, user.username, user.email)

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.json({ accessToken: newAccessToken })
    } catch (error) {
        return res.status(403).json({ message: "invalid or expired refresh token" })
    }
})


auth.post('/logout', async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    await prisma.user.updateMany({
        where: { refreshToken: token },
        data: { refreshToken: null }
    })

    res.clearCookie('refreshToken', { path: '/refresh' });
    res.sendStatus(200)
})











auth.get("/update/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    console.log("user", req.user)
    console.log(email)
})

auth.post('/reset', (req, res) => {
    const { id, abdi } = req.body;
    console.log(id, abdi)
    res.json({ id, abdi })
})

export default auth