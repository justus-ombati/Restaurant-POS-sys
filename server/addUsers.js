const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/userModel'); // Ensure the correct path to the User model

const addUsers = async () => {
    try {
        // Read user data from the JSON file
        const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

        await mongoose.connect('mongodb+srv://restaurantPOS:M0ney125@restaurantdata.xwugazw.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        for (const userData of users) {
            const hashedPin = await bcrypt.hash(userData.pin, 12);
            userData.pin = hashedPin;

            const newUser = new User(userData);
            await newUser.save();
        }

        console.log('Users added successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error adding users:', error);
    }
};

addUsers();