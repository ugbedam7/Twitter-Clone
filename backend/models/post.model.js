import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    text: {
      type: String
    },

    img: {
      type: String
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    // Post schema supports nested comments.
    comments: [
      {
        text: {
          type: String,
          required: true
        },

        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
