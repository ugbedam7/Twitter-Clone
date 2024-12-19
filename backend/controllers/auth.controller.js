import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import logger from '../lib/utils/logger.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { signUpSchema } from '../services/userValidation.js';
import { z } from 'zod';

export const signUp = async (req, res) => {
  try {
    const { username, fullname, email, password } = signUpSchema.parse(
      req.body
    );

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: 'User created successfully!',
        data: {
          _id: newUser._id,
          fullname: newUser.fullname,
          username: newUser.username,
          email: newUser.email,
          followers: newUser.followers,
          following: newUser.following,
          profileImg: newUser.profileImg,
          coverImg: newUser.coverImg
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Handle validation errors
      const errors = err.errors.map((e) => e.message);
      return res.status(400).json({ error: errors });
    }
    logger.error(`Error in signup controller: ${err.message}`);
    res.status(500).json({ Error: `Internal server error: ${err.message}` });
  }
};

// @Login Controller
export const login = async (req, res) => {
  try {
    // The controller extracts the validated fields (username and password)
    // to use them for logic
    const { username, password } = req.validatedBody;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: 'Login successful',
      data: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg
      }
    });
  } catch (err) {
    logger.error(`Error in login controller: ${err.message}`);
    res.status(500).json({
      Error: `Internal server error: ${err.message}`
    });
  }
};

// @Logout Controller
export const logout = async (req, res) => {
  // Destroy the session or invalidates the token when
  // the user logs out
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: 'User logged out.'
    });
  } catch (err) {
    logger.error(`Error in logout controller: ${err.message}`);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${err.message}`
    });
  }
};

export const authCheck = async (req, res) => {
  try {
    // Check if user's session or authentication token is still valid.
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found!'
      });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error in authCheck controller: ${err.message}`);
    res.status(500).json({
      Error: `Internal server error: ${err.message}`
    });
  }
};
