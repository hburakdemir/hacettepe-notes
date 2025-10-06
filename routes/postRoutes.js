import express from 'express';
import multer from 'multer';
import {
  addPostController,
  getAllPostsController,
  getMyPostController,
  deletePostController,
  getPendingPostsController,
  approvePostController,
  rejectPostController,
  deletePostAdminController,
  getAllPostsWithStatus,
  getApprovedPostsController
} from '../controllers/postController.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Dosya depolama konumu ve isimlendirme
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Mevcut route'lar
router.post('/addpost', authenticateToken, upload.single('file'), addPostController);
router.get('/getpost', getAllPostsController);
router.get('/my-posts', authenticateToken, getMyPostController);
router.delete('/deletepost/:postId', authenticateToken, deletePostController);

// Admin/Moderator route'ları
router.get('/pending', authenticateToken, checkRole('moderator', 'admin'), getPendingPostsController);
router.get('/approved', authenticateToken, checkRole('moderator', 'admin'), getApprovedPostsController);
router.get('/all-status', authenticateToken, checkRole('moderator', 'admin'), getAllPostsWithStatus);
router.patch('/:postId/approve', authenticateToken, checkRole('moderator', 'admin'), approvePostController);
router.patch('/:postId/reject', authenticateToken, checkRole('moderator', 'admin'), rejectPostController);
router.delete('/:postId/admin-delete', authenticateToken, checkRole('moderator', 'admin'), deletePostAdminController);

export default router;