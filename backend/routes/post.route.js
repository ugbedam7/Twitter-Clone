import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost
} from '../controllers/post.controllers.js';

const router = express.Router();

router.get('/', protectRoute, getAllPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.get('/likes/:id', protectRoute, getLikedPosts);
router.post('/', protectRoute, createPost);
router.delete('/:postId', protectRoute, deletePost);
router.post('/:postId/comment', protectRoute, commentOnPost);
router.post('/:postId/like', protectRoute, likeUnlikePost);

export default router;
