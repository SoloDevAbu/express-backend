import express, { RequestHandler } from 'express';
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', registerUser as RequestHandler);
router.post('/login', loginUser as RequestHandler);
router.get('/profile', protect as RequestHandler, getProfile as RequestHandler);
router.put('/profile/update', protect as RequestHandler, updateProfile as RequestHandler);

export default router;