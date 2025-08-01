import { config } from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local` }); // This extracts our environmental variables.
//To be specific, this parses the key pair values from our two different paths, the .development local or the .production local into the process.env
//Since each env file has their own, NODE_ENV this creates a dynamic path to decide which.
//This statement is basically saying that if is set as production, we use the production env if not, we default to the development one


export const {
    PORT, NODE_ENV, SERVER_URL,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_KEY, ARCJET_ENV,
    QSTASH_URL, QSTASH_TOKEN,
    EMAIL_PASSWORD,
} = process.env; // we can export them through this since this is a destructuring object. From the config call, we can assign the value of these env variables using destructuring