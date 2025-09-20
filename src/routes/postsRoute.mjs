import { Router } from "express";
import postControllers from "../controllers/postControllers.mjs";
const postsRoute = Router()


postsRoute.post('/', postControllers.createPost)

postsRoute.get('/draft', postControllers.getDrafts)

// postsRoute.get('/:id', postControllers.getSinglePost)

postsRoute.patch('/unpublish', postControllers.unpublishPost)
postsRoute.patch('/publish', postControllers.publishPost)

postsRoute.patch('/:id', postControllers.updatePost)

postsRoute.delete('/:id', postControllers.deletePost)

export default postsRoute