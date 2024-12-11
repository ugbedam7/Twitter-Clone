import express from 'express';
import {
  authCheck,
  login,
  logout,
  signUp
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/auth-check', protectRoute, authCheck);
router.post('/auth/signup', signUp);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

export default router;
