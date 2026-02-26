import { Router } from 'express';
import { authRequired } from '../middleware/auth.middleware.js';
import { requestPayment, verifyPayment } from '../controllers/payment.controller.js';

const router = Router();
router.post('/request', authRequired, requestPayment);
router.post('/verify', authRequired, verifyPayment);
export default router;
