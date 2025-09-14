import { Router } from "express";
import postControllers from "../controllers/postControllers.mjs";
const postsRoute = Router()


postsRoute.post('/', postControllers.createPost)

postsRoute.get('/draft', postControllers.getDrafts)

// postsRoute.get('/:id', postControllers.getSinglePost)

postsRoute.patch('/:id', postControllers.updatePost)

postsRoute.delete('/:id', postControllers.deletePost)

export default postsRoute