import express from 'express';
import { ratePostController, getPostRatingController } from "../controllers/ratingController.js";
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/rate", authenticateToken, ratePostController);

router.get("/getRate/:post_id",authenticateToken, getPostRatingController);

export default router;