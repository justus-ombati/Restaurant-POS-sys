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
        required: [true, 'Please provide a PIN'],
        minlength: 4,
        maxlength: 4,
        validate: {
            validator: function(val) {
                return /^\d{4}$/.test(val);
            },
            message: 'PIN should be a 4-digit number'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'kitchen', 'waitstaff'],
        required: [true, 'Please provide a role']
    }
}, { timestamps: true });

// userSchema.pre('save', async function(next) {
//     if (!this.isModified('pin')) return next();
//     this.pin = await bcrypt.hash(this.pin, 12);
//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;