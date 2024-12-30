import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile
} from '../controllers/user.controller.js';
import multer from 'multer';

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.get('/:username/profile', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/:id/follow', protectRoute, followUnfollowUser);
router.post('/update', protectRoute, updateUserProfile);

export default router;
