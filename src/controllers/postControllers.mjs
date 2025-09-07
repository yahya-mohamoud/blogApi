import prisma from "../../prisma.mjs"

const getAllPosts = async (req, res) => {
    const posts = await prisma.post.findMany({
        include: {
            comments: true
        }
    })
    res.json(posts)
}

const getSinglePost = async (req, res) => {
    const id = parseInt(req.params.id)
    const post = await prisma.post.findFirst({
        where: { id },
        include: {
            comments: {
                where: {postId: id}
            }
        }
    })
    res.json( post )
}

const createPost = async (req, res) => {
    const { title, content, imageUrl } = req.body;
    console.log(title, content, imageUrl)
    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                imageUrl
            }
        })
        res.json(post)
    } catch (error) {
        res.status(404).json("error: can not create a post")
    }
}

const updatePost = async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    console.log(title, content)
    try {
        const updatedData = {};

        if (title !== undefined) updatedData.title = title;
        if (content !== undefined) updatedData.content = content;

        const updatePost = await prisma.post.update({
            where: { id },
            data: {
                title: title,
                content: updatedData
            }
        })
        res.json(updatePost)
    } catch (error) {
        res.status(404).json("error: Post not found")
    }
}

const deletePost = async (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)
    try {
        const posts = await prisma.post.delete({
            where: { id },
            include: {
                comments: true
            }
        })
        res.json(posts)
    } catch (error) {
        res.status(404).json("error: post not found")
    }
}

export default { getAllPosts, getSinglePost, updatePost, deletePost, createPost }