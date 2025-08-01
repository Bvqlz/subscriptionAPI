import {JWT_SECRET} from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// someone is making a request to get user details. -> authorize middle. -> verify -> if valid -> next -> get user details
// express passes these req, res, and next objects to our middleware functions. Remember that express is the framework that is being used.
// req contains http info about our request (headers, body, url parameters)
// res sned back an http response to our client
// we use next at the very end which passes control to the next function in the stack.
const authorize = async(req, res, next) => {
    try {
        let token; // create a token

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // this gets the actual token from the headers. We ensure a header starts with that and we get the second element
        }

        if(!token) return res.status(401).json({message: 'Unauthorized'}); // only happens if we dont find the token

        const decoded = jwt.verify(token, JWT_SECRET); // ensures the token hasn't been changed and gives back original data.

        const user = await User.findById(decoded.userId); //remember that we created a model (i think a table?) with the word User. So within the decoded token we can access the userId

        if(!user) return res.status(401).json({message: 'Unauthorized'}); //if we dont find the user in the database, we call 401

        req.user = user; // if we do we attach this user and their info to our request as still has to go to the getUser in the controller

        next(); // this is important because this what allows to go to the next function in the stack
    } catch(error) {
        res.status(401).json({message: 'Unauthorized', error: error.message});
    }
}

export default authorize;