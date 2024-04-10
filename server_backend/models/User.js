import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user', // can be changed to admin
    }
}, { timestamps: true });

// Middleware to hash password before saving a user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // hashes if password is changed or new
    this.password = await bcrypt.hash(this.password, 12); 
    next();
});


const User = mongoose.model('User', userSchema);

export default User;

