import logger from '../lib/utils/logger.js';
import { createNotification } from '../services/notification.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {
  deleteProfileImageFromCloudinary,
  uploadProfileImageToCloudinary
} from '../services/cloudinary.js';
import { validateUpdateProfile } from '../services/userValidation.js';

// @Get User Controller
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user)
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });

    res.status(200).json({ success: true, user });
  } catch (err) {
    logger.error(`Error in getUserProfile controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @Follow Or Unfollow User Controller
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = await User.findById(id);
    const authenticatedUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: "You can't follow or unfollow yourself"
      });
    }

    if (!targetUser || !authenticatedUser) {
      return res.status(400).json({
        success: false,
        error: 'User not found'
      });
    }

    const isFollowing = authenticatedUser.following.includes(id);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({
        success: true,
        message: 'User unfollowed successfully'
      });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // Send a notfication to the user
      await createNotification(req.user._id, targetUser._id, 'follow');

      res.status(200).json({
        success: true,
        message: 'User followed successfully'
      });
    }
  } catch (err) {
    logger.error(`error in followUnfollowUser controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @User Suggestion API
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId).select('following').lean();

    // Use MongoDB aggregation pipeline for efficient user suggestion
    const suggestedUsers = await User.aggregate([
      {
        $match: {
          // Exclude current user and already followed users
          _id: {
            $nin: [userId, ...(currentUser?.following || [])]
          }
        }
      },

      {
        $sample: { size: 10 }
      },

      {
        // Project only necessary fields to reduce payload
        $project: {
          fullname: 1,
          username: 1,
          profileImg: 1,
          bio: 1
        }
      }
    ]);

    // Limit to 4 suggestions
    const limitedSuggestions = suggestedUsers.slice(0, 4);
    res.status(200).json({
      success: true,
      limitedSuggestions
    });
  } catch (err) {
    logger.error(`Error in suggestedUsers controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Unable to fetch suggested users: ${err.message}`
    });
  }
};

// @Update User Profile API
export const updateUserProfile = async (req, res) => {
  const userId = req.user._id;
  let { profileImg, coverImg } = req.body;

  // Input validation
  const { error, value } = validateUpdateProfile(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input',
      errors: error.details.map((err) => err.message)
    });
  }

  // Destructure validated input
  const { fullname, email, username, currentPassword, newPassword, bio, link } =
    value;

  try {
    let user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, error: 'User not found' });

    // Password update logic
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Profile image update
    if (profileImg) {
      // Delete existing image from Cloudinary if exists
      if (user.profileImg) {
        await deleteProfileImageFromCloudinary(user.profileImg);
      }

      // Upload new image
      const uploadedResponse = await uploadProfileImageToCloudinary(
        profileImg,
        'X-Profile_Images'
      );
      profileImg = uploadedResponse.secure_url;
    }

    // Cover image update
    if (coverImg) {
      if (user.coverImg) {
        await deleteProfileImageFromCloudinary(user.coverImg);
      }

      // Upload new cover image
      const uploadedResponse = await uploadProfileImageToCloudinary(
        coverImg,
        'X-Cover_Images'
      );
      coverImg = uploadedResponse.secure_url;
    }

    // Update user fields
    const updateFields = [
      'fullname',
      'email',
      'username',
      'bio',
      'link',
      'profileImg',
      'coverImg'
    ];

    updateFields.forEach((field) => {
      if (value[field]) {
        user[field] = value[field];
      }
    });

    user = await user.save({ validateModifiedOnly: true });
    // Prepare response (exclude sensitive data)
    const updatedUser = user.toObject();
    delete updatedUser.password;

    // Log the update action
    logger.info(`User profile updated successfully`);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    logger.error(`Profile update error for user ${userId}: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};
