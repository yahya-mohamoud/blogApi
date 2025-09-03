import express from "express";
import dotenv from "dotenv";
import postsRoute from "./src/routes/postsRoute.mjs";
import commentsRouter from "./src/routes/commentsRoute.mjs";
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/api', (req, res) => {
    res.json( "hello blog API")
})
app.use('/api/posts', postsRoute)
app.use('/api/comments', commentsRouter)
app.listen(PORT, console.log(`app started on port: ${PORT}`))