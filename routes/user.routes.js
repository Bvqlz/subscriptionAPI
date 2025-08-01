import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js'
import {getUser, getUsers} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsers)
//This is a dynamic parameter i.g GET /users/:id -> this gets the user by id
userRouter.get('/:id', authorize, getUser)

userRouter.post('/:id', (req, res) => res.send({title: 'CREATE new user '}))

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE user'}))

userRouter.delete('/:id', (req, res) => res.send({title: 'Delete user'}))

export default userRouter;