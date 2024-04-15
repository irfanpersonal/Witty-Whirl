import express from 'express';
const router: express.Router = express.Router();

import {register, login, logout} from '../controllers/auth';

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);

export default router;