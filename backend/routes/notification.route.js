import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import {
  deleteNotifications,
  deleteNotification,
  getNotifications
} from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', protectRoute, getNotifications);
router.delete('/', protectRoute, deleteNotifications);
router.delete('/:notificationId', protectRoute, deleteNotification);

export default router;
