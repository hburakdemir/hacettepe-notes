// routes/updateProfileRoutes.js
import express from 'express';
import { handleUpdateProfile } from '../controllers/updateprofileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// PUT /api/profile → JWT ile korunan route
router.put('/profile', authenticateToken, handleUpdateProfile);

export default router;
