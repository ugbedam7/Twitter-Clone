import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/:id/follow', protectRoute, followUnfollowUser);
router.patch('/profile/update', protectRoute, updateUserProfile);

export default router;
