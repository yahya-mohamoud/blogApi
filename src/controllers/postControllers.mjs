import prisma from "../../prisma.mjs"

const getAllPosts = async (req, res) => {
    const posts = await prisma.post.findMany({
        include: {
            comments: {
                include: { author: true }
            },
        }
    })
    res.json(posts)
}
const getPublishedPosts = async (req, res) => {
    const posts = await prisma.post.findMany({
        where: {
            published: true,
        },
        include: {
            author: true,
            comments: {
                include: { author: true }
            },
        }
    })
    res.json(posts)
}

const getSinglePost = async (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)
    const post = await prisma.post.findFirst({
        where: { id },
        include: {
            author: true,
            comments: {
                where: { postId: id },
                include: { author: true }
            },
        }
    })
    res.json(post)
}

const createCategories = async (req, res) => {
    const { category } = req.body;

    const checkCategory = await prisma.category.findFirst({
        where: { categoryName: category }
    })

    if (checkCategory) return res.status(403).json({ message: "Category already exists, please try again" })

    const data = await prisma.category.create({
        data: {
            categoryName: category
        }
    })

    res.json(data)
}

const getAllCategories = async (req, res) => {
    const categories = await prisma.category.findMany({
        include: {
            Post_Categories: {
                include: {
                    categories: true
                }
            }
        }
    })

    res.json(categories)
}

const getSingleCategory = async (req, res) => {
    const id = parseInt(req.params.id);

    const category = await prisma.post_Categories.findMany({
        where: { categoryId: id },
        include: {
            post: {
                include: {
                    author: true
                },
            },
            categories: true
        },
    })
    console.log(category)
    res.json(category)
}

const createPost = async (req, res) => {
    const { title, content, imageUrl, categoryName } = req.body; // send the category ID
    const id = req.user.id;
    const published = req.body.published === "True";
    const categoryId = parseInt(req.body.categoryId)
    try {

        const categories = await prisma.category.findFirst({
            where: {
                categoryName
            }
        })

        console.log(categories)
        const post = await prisma.post.create({
            data: {
                title,
                content,
                imageUrl,
                published,
                author: { connect: { id } },
                Post_Categories: {
                    create: [
                        {
                            categories: { connect: { id: categories.id } }
                        }
                    ]
                }
            },
            include: {
                Post_Categories: { include: { categories: true } }
            }
        });

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Cannot create post", details: error.message });
    }
};


const updatePost = async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id)
    const { title, content, published, imageUrl } = req.body;

    try {
        const updatePost = await prisma.post.update({
            where: { id },
            data: {
                title: title,
                content: content,
                imageUrl,
                published
            }
        })
        res.json(updatePost)
    } catch (error) {
        res.status(404).json("error: Post not found")
    }
}

const deletePost = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const posts = await prisma.post.delete({
            where: { id },
            include: {
                comments: true
            }
        })
        console.log(posts)
        res.json(posts)
    } catch (error) {
        res.status(404).json("error: post not found")
    }
}

const getDrafts = async (req, res) => {
    const drafts = await prisma.post.findMany({
        where: {
            published: false
        }, include: {
            author: true,
            comments: {
                include: { author: true }
            }
        }
    })

    if (!drafts) {
        res.json({ message: "There is no unpublished posts" })
    }

    res.json(drafts)
}

const unpublishPost = async (req, res) => {
    const id = parseInt(req.body.id);
    try {
        const unpublishedPost = await prisma.post.update({
            where: { id },
            data: {
                published: false
            }
        })
        res.json(unpublishedPost)
    } catch (error) {
        console.log(error)
        res.json({ message: "something went wrong" })
    }
}

const publishPost = async (req, res) => {
    const id = parseInt(req.body.id);
    try {
        const publishedPost = await prisma.post.update({
            where: { id },
            data: {
                published: true
            }
        })
        res.json(publishedPost)
    } catch (error) {
        console.log(error)
        res.json({ message: "something went wrong" })
    }
}

export default {
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    createPost,
    getDrafts,
    getPublishedPosts,
    unpublishPost,
    publishPost,
    createCategories,
    getAllCategories,
    getSingleCategory
}