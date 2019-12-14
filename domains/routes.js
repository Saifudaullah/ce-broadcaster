import express from 'express'
import WebController from './webs/web.controller'
import AuthController from './auth/auth.controller';

import ApiJobController from './api/api.jobs.controller';

const router = express.Router();

router.get('/', WebController.index);


//auth router
router.get('/auth/login', AuthController.index);
router.post('auth/login', AuthController.login);


router.get('/api/v1/broadcast_jobs', ApiJobController.index);
export default router;