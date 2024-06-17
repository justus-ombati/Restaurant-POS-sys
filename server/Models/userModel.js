const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        required: [true, 'Please provide an ID number'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    pin: {
        type: String,
        required: [true, 'Please provide a pin'],
        validate: {
            validator: function (value) {
                // This validation will only run on save and create
                return value.length === 60 || /^\d{4}$/.test(value);
            },
            message: 'PIN must be a valid 4-digit number or a hashed value'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'kitchen', 'waitstaff'],
        required: [true, 'Please provide a role']
    },
    createdAt: { 
        type: Date,
        default: Date.now
    },
    updatedAt: { type: Date, default: Date.now }
});

// userSchema.pre('save', async function(next) {
//     if (!this.isModified('pin')) return next();
//     this.pin = await bcrypt.hash(this.pin, 12);
//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;