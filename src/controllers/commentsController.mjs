import prisma from "../../prisma.mjs";

const getAllComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
        })
        res.json(comments)
    } catch (error) {
        res.status(404).json("error: no post found", error)
    }
}

const getSingleComment =  async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const comment = await prisma.comment.findUnique({
            where: { id }
        })
        res.json(comment)
    } catch (error) {
        res.status(404).json("error: unable to get the comment", error)
    }
}

const createComment = async (req, res) => {
    const { content } = req.body;
    const postId = parseInt(req.body.postId);
    console.log(content, postId)
    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId
            }
        })
        console.log(comment)
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json("error: unable to create a comment", error)
    }
}

const updateComment =  async (req, res) => {
    const id = parseInt(req.params.id)
    const { content } = req.body
    try {
        const comment = await prisma.comment.update({
            where: { id },
            data: {
                content
            }
        })
        res.json(comment)
    } catch (error) {
        res.status(500).json("error: couldn't find the comment", error)
    }
}

const deleteComment =  async (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)
    try {
        await prisma.comment.delete({
            where: { id },
        })
        res.redirect('/api/comments')
    } catch (error) {
        res.status(500).json("error: couldn't find the comment", error)
    }
}


export default {getAllComments, getSingleComment, updateComment, createComment, deleteComment}