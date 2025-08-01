import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'
import arcjetMiddleware from './middlewares/arcjet.middleware.js'
import workflowRouter from './routes/workflow.routes.js'

const app = express(); // creates an instance of an express application

app.use(express.json()); // parses incoming requests as json payloads into javascript objects allowing to use them on req.body
app.use(express.urlencoded({ extended: false })); //parses requests with url payloads
app.use(cookieParser()); //parses cookies attached to a client request making them avalible in req.cookies
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware); // this is a global error checker, reference the controllers to see what error.status is. Any throw error that is not caught locally goes here.

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API!');
});

//this starts the express server
app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase(); // will allow us to create sessions, obtain from collections, and such.
});

export default app;