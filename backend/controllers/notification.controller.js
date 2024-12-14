import logger from '../lib/utils/logger.js';
import Notification from '../models/notification.model.js';

// Get All Notification
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: 'from',
      select: 'username profileImg'
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json({ Count: notifications.length, notifications });
  } catch (err) {
    logger.error(`Error in getNotification controller: ${err.message}`);
    res.status(500).json({
      success: false,
      Error: `Internal server error: ${err.message}`
    });
  }
};

// Delete All Notification
export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    logger.info('Notifications deleted successfully');

    res
      .status(200)
      .json({ success: true, message: 'Notifications deleted successfully' });
  } catch (err) {
    logger.error(`Error in deleteNotification controller: ${err.message}`);
    res.status(500).json({
      success: false,
      Error: `Internal server error: ${err.message}`
    });
  }
};

// Delete One Notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);

    // Check if notification exist
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: 'Notification not found' });
    }

    // Check for authorization
    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Notification cannot be deleted'
      });
    }

    await Notification.findByIdAndDelete(notificationId);
    logger.info('Notification deleted successfully');
    res
      .status(200)
      .json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    logger.error(`Error in deleting notification: ${err.message}`);
    res.status(500).json({
      success: false,
      Error: `Internal server error: ${err.message}`
    });
  }
};
