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
const allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'];


const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error('Geçersiz dosya türü. Yalnızca PDF, Word, PowerPoint ve resim dosyalarına izin verilmektedir.'));
    }
  },
});

// aşağı ekledik
// router.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ message: 'Dosya çok büyük, maksimum 10MB olabilir.' });
//   } else if (err) {
//     return res.status(400).json({ message: err.message });
//   }
//   next();
// });




// dosya tür kontrolü
router.post('/addpost',authenticateToken,(req, res, next) => {
  upload.array('files', 5)(req, res, function(err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next(); 
    });
  },
  addPostController
);


router.get('/getpost', getAllPostsController);
router.get('/my-posts', authenticateToken, getMyPostController);
router.delete('/deletepost/:postId', authenticateToken, deletePostController);


router.get('/pending', authenticateToken, checkRole('moderator', 'admin'), getPendingPostsController);
router.get('/approved', authenticateToken, checkRole('moderator', 'admin'), getApprovedPostsController);
router.get('/all-status', authenticateToken, checkRole('moderator', 'admin'), getAllPostsWithStatus);
router.patch('/:postId/approve', authenticateToken, checkRole('moderator', 'admin'), approvePostController);
router.patch('/:postId/reject', authenticateToken, checkRole('moderator', 'admin'), rejectPostController);
router.delete('/:postId/admin-delete', authenticateToken, checkRole('moderator', 'admin'), deletePostAdminController);

export default router;