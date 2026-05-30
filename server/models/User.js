// ====================================================================
// server/models/User.js - User Authentication Data Schema
// ====================================================================

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name metric is mandatory'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Account authorization email is required'],
        unique: true, // Prevents duplicate registrations with the same email
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Cryptographic security hash string is required'],
        minlength: [6, 'Password parameters must exceed 6 character marks']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);