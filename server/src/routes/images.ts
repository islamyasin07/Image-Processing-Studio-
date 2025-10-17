import { Router } from 'express';
import { getImage, listImages } from '../controllers/images.controller';

const router = Router();
router.get('/', getImage);       
router.get('/list', listImages);
export default router;
