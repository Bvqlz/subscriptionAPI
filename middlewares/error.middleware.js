const errorMiddleware = (err, req, res, next) => {
    try { // here we are intercepting the error to have a little more info about it
        let error = {...err}; // destructures err
        error.message = err.message;
        console.error(err);

        // say if mongoose bad objectID
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if(err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        // when ever we pass an next(error) from a try catch block and the error name/code doesn't match it goes here
        // if we have a status code we pass it else it defaults to 500. Nontheless, we send the error message else we default again.
        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'});
    } catch (error) {
        next(error);
    }
}
// Create a subscription -> middleware (check for renewal date) -> middleware (check for errors) -> next -> controller
// Middleware is a block of code that is executed before or after something allowing to intercept what is happening

export default errorMiddleware;