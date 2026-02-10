import dotenv from "dotenv"
dotenv.config()
import { Router } from "express";
import { adminLogin, createAdmin, logout, refreshRoute, registerUser, userLogin } from "../controllers/authController.mjs";

const auth = Router()

auth.get('/', async (req, res) => {
    const user = await prisma.user.findMany();

    res.json(user)
})

auth.post('/userlogin', userLogin)

auth.post('/adminlogin', adminLogin)

auth.post("/createadmin", createAdmin)

auth.post('/signup', registerUser)

// auth.post("/confirm", async (req, res) => {
//     const { email } = req.body;

//     const userEmail = await prisma.user.findFirst({
//         where: { email }
//     })

//     if (!userEmail) {
//         res.status(404).json({ message: "unknown email, please try again", result: 0 })
//     } else {
//         res.json({ email, result: 1 })

//     }

// })

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

auth.post('/refresh', refreshRoute)

auth.post('/logout', logout)

// auth.get("/update/:id", async (req, res) => {
//     const id = parseInt(req.params.id);
//     console.log("user", req.user)
//     console.log(email)
// })

// auth.post('/reset', (req, res) => {
//     const { id, abdi } = req.body;
//     console.log(id, abdi)
//     res.json({ id, abdi })
// })

export default auth