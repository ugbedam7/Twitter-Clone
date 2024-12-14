import express from 'express';
import {
  authCheck,
  login,
  logout,
  signUp
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { validateLogin } from '../middlewares/loginValidation.js';

const router = express.Router();

router.get('/auth-check', protectRoute, authCheck);
router.post('/signup', signUp);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;
