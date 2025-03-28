import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserDocument } from '../types/user.types';

const userSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String }
}, {
    timestamps: true
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    console.log("Console from comparePassword", candidatePassword, this.password)
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<UserDocument>('User', userSchema);