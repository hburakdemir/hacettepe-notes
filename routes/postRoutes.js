import express from 'express';
import multer from 'multer';
import { addPostController, getAllPostsController, getMyPostController, deletePostController} from '../controllers/postController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Dosya depolama konumu ve isimlendirme
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // uploads klasörü olmalı
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 40MB sınırı
});

// Burada sırayla:
// 1. authenticateToken
// 2. upload.single('file') (input name 'file' olacak frontendde)
// 3. addPostController
router.post('/addpost', authenticateToken, upload.single('file'), addPostController);
router.get('/getpost', getAllPostsController);
router.get('/my-posts',authenticateToken, getMyPostController)
router.delete('/deletepost/:postId',authenticateToken, deletePostController)

export default router;
