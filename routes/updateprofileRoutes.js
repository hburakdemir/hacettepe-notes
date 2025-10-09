// routes/updateProfileRoutes.js
import express from 'express';
import db from '../db.js';
import { handleUpdateProfile } from '../controllers/updateprofileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// PUT /api/profile → JWT ile korunan route
router.patch('/profile', authenticateToken, handleUpdateProfile);


export default router;
