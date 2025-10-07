import express from 'express';
import { register } from '../controllers/registerController.js';
import { verifyEmailCode ,resendVerificationCode} from '../controllers/verifyController.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmailCode);
router.post('/resend-code', resendVerificationCode)

export default router;
