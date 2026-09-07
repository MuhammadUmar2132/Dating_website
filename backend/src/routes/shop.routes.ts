import { Router } from 'express';
import * as shop from '../controllers/shop.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/products', shop.getProducts);
router.post('/checkout', authMiddleware, shop.createCheckout);
// Raw body needed for Stripe signature verification
router.post('/webhook', shop.stripeWebhook);

export default router;
