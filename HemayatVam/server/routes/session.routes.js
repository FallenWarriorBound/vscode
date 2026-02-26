import { Router } from 'express';
import { authRequired } from '../middleware/auth.middleware.js';
import { listSessions, revokeSession } from '../controllers/session.controller.js';
const router = Router();
router.get('/list', authRequired, listSessions);
router.post('/revoke', authRequired, revokeSession);
export default router;
