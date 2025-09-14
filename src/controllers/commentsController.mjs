import prisma from "../../prisma.mjs";

const getAllComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            include: {
                author: true
            }
        })
        res.json(comments)
    } catch (error) {
        res.status(404).json("error: no post found", error)
    }
}

const getSingleComment = async (req, res) => {
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
    const { content, postId } = req.body;
    const authorId = req.user.id
    const Id = parseInt(postId);

    if (!Id) return res.status(400).json({ message: "postId is required" });

    const post = await prisma.post.findUnique({ where: { id: Id } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                post: { connect: { id: Id } },
                author: { connect: { id: authorId } }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
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

const deleteComment = async (req, res) => {
    try {
        const commentId = parseInt(req.params.id)
        const authorId = parseInt(req.user.id)
        const comment = await prisma.comment.findFirst({
             where: {id: commentId}
            })
        if(!comment) {
            return res.status(404).json({message: "comment not found"})
        }

        if(comment.authorId !== authorId) {
            return res.status(403).json({message: "not allowed to delete this comment"})
        }

        const dlt = await prisma.comment.delete({
            where: {id: commentId}
        })
            console.log(dlt)
    } catch (error) {
        
    }
}


export default { getAllComments, getSingleComment, updateComment, createComment, deleteComment }