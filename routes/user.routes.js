import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js'
import {getUser, getUsers} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsers)
//This is a dynamic parameter i.g GET /users/:id -> this gets the user by id
userRouter.get('/:id', authorize, getUser) //whats happening here is that we pass our call through our middleware, if everything is clear, our request is sent to our controller

userRouter.post('/:id', (req, res) => res.send({title: 'CREATE new user '}))

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE user'}))

userRouter.delete('/:id', (req, res) => res.send({title: 'Delete user'}))

export default userRouter;