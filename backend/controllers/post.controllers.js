import logger from '../lib/utils/logger.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import {
  deletePostImageFromCloudinary,
  uploadPostImageToCloudinary
} from '../services/cloudinary.js';
import { createNotification } from '../services/notification.js';

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: '-password' })
      .populate({ path: 'comments.user', select: '-password' });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json({ Count: posts.length, posts });
  } catch (err) {
    logger.error(`Error in likeUnlikePost controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};

// Get All User's Liked Posts
export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found!' });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: 'user', select: '-password' })
      .populate({ path: 'comments.user', select: '-password' });

    res.status(200).json({ Count: likedPosts.length, likedPosts });
  } catch (err) {
    logger.error(`Error in getLikedPosts controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};

// Get Following Posts
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found!' });
    }

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: '-password' })
      .populate({ path: 'comments.user', select: '-password' });

    res.status(200).json({ success: true, feedPosts });
  } catch (err) {
    logger.error(`Error in getFollowingPosts controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};

// Get User Posts
export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ success: false, error: 'User not found!' });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: '-password' })
      .populate({ path: 'comments.user', select: '-password' });

    res.status(200).json({ Count: posts.length, posts });
  } catch (err) {
    logger.error(`Error in getUserPosts controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};

// Create Post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });

    if (!text && !img)
      return res
        .status(400)
        .json({ success: false, error: 'Post must have text or image' });

    // Upload image if available
    if (img) {
      const updloadResponse = await uploadPostImageToCloudinary(
        img,
        'X-Post-Images'
      );
      img = updloadResponse.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      img
    });

    await newPost.save();
    logger.info('Post created successfully');
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });
  } catch (err) {
    logger.error(`Error creating post: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};

// Delete User Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found!' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "Unauthorized: You can't delete this post" });
    }

    if (post.img) {
      await deletePostImageFromCloudinary(post.img, 'X-Post-Images');
    }

    await Post.findByIdAndDelete(req.params.id);
    logger.info('Post deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (err) {
    logger.error(`Error in delete post controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal Server error: ${err.message}`
    });
  }
};

// Comment On Post
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text || text == '') {
      return res.status(400).json({ error: 'Text field is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const comment = {
      user: userId,
      text
    };

    post.comments.push(comment);
    await post.save();
    logger.info('Comment created successfully');

    // Send comment notification
    await createNotification(userId, post.user, 'comment');

    res.status(200).json({
      success: true,
      message: 'Comment created successfully',
      post
    });
  } catch (err) {
    logger.error(`Error in comment on post controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};

// Like and Unlike Post
export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: userId } });
      res.status(200).json({ message: 'Post unliked successfully' });
    } else {
      // Like the post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      //Send like notification
      await createNotification(userId, post.user, 'like');
      res
        .status(200)
        .json({ success: true, message: 'Post liked successfully' });
    }
  } catch (err) {
    logger.error(`Error in likeUnlikePost controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};
