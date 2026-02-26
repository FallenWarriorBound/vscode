import { Router } from 'express';
import { authRequired } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimit.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { ensureStepFee } from '../middleware/registrationFee.middleware.js';
import {
  adminApproveUser,
  login,
  refreshSession,
  registerBiometric,
  step1Register,
  step2SetPassword,
  step3Identity,
  step4UploadDocs,
  submitKYC,
  verify2FA
} from '../controllers/auth.controller.js';

const router = Router();
router.post('/register/step1', authRateLimiter, step1Register);
router.post('/register/step2', authRequired, ensureStepFee, step2SetPassword);
router.post('/register/step3', authRequired, ensureStepFee, step3Identity);
router.post('/register/step4', authRequired, ensureStepFee, step4UploadDocs);
router.post('/login', authRateLimiter, login);
router.post('/refresh', refreshSession);
router.post('/2fa/verify', authRequired, verify2FA);
router.post('/kyc/submit', authRequired, submitKYC);
router.post('/biometric/register', authRequired, registerBiometric);
router.patch('/admin/approve/:userId', authRequired, requireRole('SuperAdmin', 'FinancialManager'), adminApproveUser);

export default router;
