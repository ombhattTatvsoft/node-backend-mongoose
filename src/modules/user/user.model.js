import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: false },
        googleId: { type: String, required: false },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    { timestamps: true }
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;