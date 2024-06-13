const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'chef'],
        default: 'chef'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
