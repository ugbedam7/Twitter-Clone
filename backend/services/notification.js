import Notification from '../models/notification.model.js';

const NotificationTypes = {
  FOLLOW: 'follow',
  LIKE: 'like',
  COMMENT: 'comment'
};

export const createNotification = async (
  fromUserId,
  toUserId,
  type,
  postId
) => {
  if (!NotificationTypes[type.toUpperCase()]) {
    throw new Error(`Invalid notification type: ${type}`);
  }

  const notification = new Notification({
    from: fromUserId,
    to: toUserId,
    type,
    post: postId
  });

  await notification.save();
  return notification;
};

export const NotificationTypeValues = Object.values(NotificationTypes);
