import express from "express";
import dotenv from "dotenv";
import postsRoute from "./src/routes/postsRoute.mjs";
import commentsRouter from "./src/routes/commentsRoute.mjs";
import auth from "./src/routes/authRouter.mjs";
import authMiddleware from "./middleware.mjs";
import cors from "cors"
import postControllers from "./src/controllers/postControllers.mjs";
import userRoute from "./src/routes/usersRoute.mjs";
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/api', (req, res) => {
    console.log("from app.mjs: ", req.user)
    res.json("hello blog API")
})
app.get('/api/posts', postControllers.getAllPosts)
// app.get('/api/posts/:id', postControllers.getSinglePost)

app.use('/api/auth', auth)
app.use('/api/users', userRoute)
app.use('/api/posts', authMiddleware, postsRoute)
app.use('/api/comments', authMiddleware, commentsRouter)
app.listen(PORT, console.log(`app started on port: ${PORT}`))