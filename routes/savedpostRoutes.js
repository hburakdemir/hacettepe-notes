import express from 'express';
import {
  savePostController,
  unsavePostController,
  getSavedPosts,
} from '../controllers/savedpostContoller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/getPost', authenticateToken, getSavedPosts);
router.post('/savePost/:postId', authenticateToken, savePostController);
router.delete('/unsavePost/:postId', authenticateToken, unsavePostController);

export default router;
