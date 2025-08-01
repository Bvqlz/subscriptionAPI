import User from '../models/user.model.js'

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find(); // find just gets a list that matches our filter. In this case our filter is the User model which contains all of our users.

        res.status(200).json({success: true, data: users});
    } catch(error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); //the req.params.id allows us to extract this id using a GET call from the path since we used a dynamic parameter
        //this then grabs the user's info except the password. Remember that we are getting this user id from the call path.

        if(!user) { // if the user doesnt exist we have an error
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        // if we dont have an error, we pass a successful call, and send a response with a tag true and then send the data itself with the user variable that contains all their info
        res.status(200).json({success: true, data: user});
    } catch(error) {
        next(error);
    }
}