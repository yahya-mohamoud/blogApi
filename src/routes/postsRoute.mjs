import { Router } from "express";
import postControllers from "../controllers/postControllers.mjs";
const postsRoute = Router()


postsRoute.post('/', postControllers.createPost)

postsRoute.get('/draft', postControllers.getDrafts)


postsRoute.patch('/unpublish', postControllers.unpublishPost)
postsRoute.patch('/publish', postControllers.publishPost)
postsRoute.get('/published', postControllers.getPublishedPosts)
postsRoute.get('/drafts', postControllers.getDrafts)
postsRoute.get('/:id', postControllers.getSinglePost)
postsRoute.patch('/:id', postControllers.updatePost)
postsRoute.patch('/:id', postControllers.updatePost)

postsRoute.delete('/:id', postControllers.deletePost)

export default postsRoute