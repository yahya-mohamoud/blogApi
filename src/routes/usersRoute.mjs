import { Router } from "express";
import prisma from "../../prisma.mjs";

const userRoute = Router()

userRoute.get("/", (req, res) => {
    res.json("hello user")
})

userRoute.get('/allusers', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                posts: {
                    include: {
                        comments: true
                    }
                }
            }
        })

        res.json(users)
    } catch (error) {
        res.status("404").json(`error: ${error}`)
    }

})

userRoute.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const user = await prisma.user.delete({
            where: { id }
        })
        res.json(user)
    } catch (error) {
        res.json({ error: error })
    }
})

userRoute.patch("/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    const {username, email} = req.body
    try {
        const user = await prisma.user.update({
            where: {id},
            data: {
                email: email,
                username: username
            }
        })
        
        res.json(user)
    } catch(error) {
        res.status(500).json({message: `oops!! something went wrong ${error}`})
    } 
})





export default userRoute;