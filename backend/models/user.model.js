import mongoose, { Mongoose, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },

    fullname: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: []
      }
    ],

    profileImg: {
      type: String,
      default: ''
    },

    bio: {
      type: String,
      default: ''
    },

    coverImg: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
