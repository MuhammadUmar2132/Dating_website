import { Router } from 'express';
import * as onboarding from '../controllers/onboarding.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/check-email', onboarding.checkEmail);
router.get('/validate-invite', onboarding.validateInvite);
router.post('/complete', onboarding.completeOnboarding);

export default router;
