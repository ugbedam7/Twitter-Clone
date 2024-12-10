import express from 'express';
import { Login, Logout, SignUp } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/auth/signup', SignUp);
router.post('/auth/login', Login);
router.post('/auth/logout', Logout);

export default router;
