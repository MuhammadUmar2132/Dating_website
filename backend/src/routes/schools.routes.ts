import { Router } from 'express';
import * as schools from '../controllers/schools.controller';

const router = Router();

router.get('/', schools.getSchools);
router.get('/markets', schools.getMarkets);

export default router;
