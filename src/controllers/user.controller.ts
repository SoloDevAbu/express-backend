import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { UserSchema, LoginSchema } from '../types/user.types';
import bcrypt from 'bcryptjs';

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const validatedData = UserSchema.safeParse(req.body);

        if(validatedData.success === false) {
            res.status(400).json({ message: validatedData.error.errors[0].message });
            return;
        }
        
        const userExists = await User.findOne({ email: validatedData.data?.email });
        if (userExists) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);
        const user = await User.create({ ...validatedData.data, password: hashedPassword });
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            name: user.name,
            email: user.email,
            address: user.address,
            bio: user.bio,
            profilePicture: user.profilePicture
        });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Invalid input data' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const validatedData = LoginSchema.safeParse(req.body);

        if(validatedData.success === false) {
            res.status(400).json({ message: validatedData.error.errors[0].message });
            return;
        }
        
        const user = await User.findOne({ email: validatedData.data.email });
        if (!user || !(await user.comparePassword(validatedData.data.password))) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            name: user.name,
            email: user.email,
            address: user.address,
            bio: user.bio,
            profilePicture: user.profilePicture
        });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Invalid input data' });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.user._id;
    try {
        const validatedData = UserSchema.partial().omit({ email: true }).safeParse(req.body);
        
        if(validatedData.success === false) {
            res.status(400).json({ message: validatedData.error.errors[0].message });
            return;
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const updateData = { ...validatedData.data };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData,
            { new: true }
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Invalid input data' });
    }
};
