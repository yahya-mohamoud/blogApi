import { Router } from "express";
import prisma from "../../prisma.mjs";
import commentsController from "../controllers/commentsController.mjs";

const commentsRouter = Router()

commentsRouter.get('/', commentsController.getAllComments)

commentsRouter.get('/:id', commentsController.getSingleComment)

commentsRouter.post('/', commentsController.createComment)

commentsRouter.patch('/:id', commentsController.updateComment)

commentsRouter.delete('/:id', commentsController.deleteComment)

export default commentsRouter