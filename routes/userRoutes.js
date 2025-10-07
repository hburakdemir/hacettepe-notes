import express from 'express';
import { getAllUsersController, updateUserRoleController,deleteUserByAdminController, updateUserEmailVerifyController } from '../controllers/userController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Tüm kullanıcıları getir (sadece admin)
router.get('/users', authenticateToken, checkRole('admin'), getAllUsersController);

// Kullanıcı rolünü güncelle (sadece admin)
router.patch('/users/:userId/role', authenticateToken, checkRole('admin'), updateUserRoleController);

// Kullanıcı silme (sadece admin)
router.delete('/users/:id',authenticateToken,checkRole('admin'),deleteUserByAdminController);

// Kullanıcı mail onaylama (admin ve mod)
router.patch('/users/:userId/email-verification',authenticateToken, checkRole('moderator', 'admin'), updateUserEmailVerifyController);

export default router;