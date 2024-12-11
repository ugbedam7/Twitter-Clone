import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import logger from '../lib/utils/logger.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signUp = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ Error: 'Invalid email format' });
    }

    const existingUser = User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ Error: 'Username is already taken' });
    }

    const existingEmail = User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ Error: 'Email is already taken' });
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
      res.status(400).json({ Error: 'Invalid user data' });
    }
  } catch (err) {
    logger.error(`Error in signup controller: ${err.message}`);
    res.status(500).json({ Error: `Internal server error: ${err.message}` });
  }
};

// @Login Controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ Error: 'Invalid credentials' });
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
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: new Date(0)
    });
    res.status(200).json({ message: 'User logged out.' });
  } catch (err) {
    logger.error(`Error in logout controller: ${err.message}`);
    res.status(500).json({
      Error: `Internal server error: ${err.message}`
    });
  }
};

export const authCheck = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error in authCheck controller: ${err.message}`);
    res.status(500).json({
      Error: `Internal server error: ${err.message}`
    });
  }
};
