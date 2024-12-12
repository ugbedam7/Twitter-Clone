import mongoose, { Schema } from 'mongoose';
import { NotificationTypeValues } from '../services/notificationTypes.js';

const notificationSchema = new Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      required: true,
      validate: {
        validator: (value) => NotificationTypeValues.includes(value),
        message: (props) => `${props.value} is not a valid notification type`
      }
    },

    read: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true
  }
);

// Indexes for query performance
notificationSchema.index({ to: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
