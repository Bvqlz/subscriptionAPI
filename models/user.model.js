import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'], // this means that the name is required and if not given this error is sent
        trim: true, //removes leading/trailing whitespace from string values
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true, // only one user can have this email
        trim: true,
        lowercase: true, // assuming that this turns all into lowercase
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // this means that a "S+" or a string must be followed by an @ where its followed by another string, dot, again another string | contact@gmail.com
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 6,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;