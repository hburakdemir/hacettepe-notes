import express from 'express';
import { getAllUsersController, updateUserRoleController } from '../controllers/userController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Tüm kullanıcıları getir (sadece admin)
router.get('/users', authenticateToken, checkRole('admin'), getAllUsersController);

// Kullanıcı rolünü güncelle (sadece admin)
router.patch('/users/:userId/role', authenticateToken, checkRole('admin'), updateUserRoleController);

export default router;