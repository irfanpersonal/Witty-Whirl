import express from 'express';
const router: express.Router = express.Router();

import {showCurrentUser, getAllUsers, getSingleUser, updateUser, updateUserPassword} from '../controllers/user';
import {authentication} from '../middleware/authentication';

router.route('/').get(authentication, getAllUsers);
router.route('/showCurrentUser').get(authentication, showCurrentUser);
router.route('/updateUser').patch(authentication, updateUser);
router.route('/updateUserPassword').patch(authentication, updateUserPassword);
router.route('/:id').get(authentication, getSingleUser);

export default router;