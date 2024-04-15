"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
const authentication_1 = require("../middleware/authentication");
router.route('/').get(authentication_1.authentication, user_1.getAllUsers);
router.route('/showCurrentUser').get(authentication_1.authentication, user_1.showCurrentUser);
router.route('/updateUser').patch(authentication_1.authentication, user_1.updateUser);
router.route('/updateUserPassword').patch(authentication_1.authentication, user_1.updateUserPassword);
router.route('/:id').get(authentication_1.authentication, user_1.getSingleUser);
exports.default = router;
