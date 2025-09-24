import dotenv from "dotenv"
dotenv.config()
import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../prisma.mjs";
import jwt from "jsonwebtoken"


const auth = Router()

auth.get('/', (req, res) => {
    res.json('hi this is auth entry')
})

auth.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.user.findFirst({
        where: { email }
    })

    if(!user) res.status(404).json({message: `user with ${email} wasn't found`})

    const ismatch = await bcrypt.compare(password, user.password)

    if (!ismatch)  res.status(401).json({message: "invalid credentials"})
    

    const token = jwt.sign({id: user.id, email: user.email, username: user.username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "40m" })

    res.json({
        message: "login successful",
        token
    })
})

auth.post('/signup', async (req, res) => {
    {
        const { username, email, password, confirm } = req.body;

        if (password !== confirm) {
            res.status(401).json({message: "passwords must be the same"})
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
})

export default auth