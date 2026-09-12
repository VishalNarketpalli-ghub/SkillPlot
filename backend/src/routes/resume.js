import express from 'express';
import { uploadResume, getResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.route('/upload')
  .post(upload.single('resume'), uploadResume);

router.route('/:id')
  .get(getResume);

export default router;
