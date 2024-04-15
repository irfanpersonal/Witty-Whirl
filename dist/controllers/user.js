"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.showCurrentUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../database/models/User"));
const utils_1 = require("../utils");
const errors_1 = __importDefault(require("../errors"));
const sequelize_1 = __importDefault(require("sequelize"));
const node_path_1 = __importDefault(require("node:path"));
const cloudinary_1 = require("cloudinary");
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findByPk(req.user.userID, {
        attributes: { exclude: ['password'] }
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.showCurrentUser = showCurrentUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, country, hobbies, sort } = req.query;
    const queryObject = {};
    if (search) {
        queryObject.name = { [sequelize_1.default.Op.like]: `%${search}%` };
    }
    if (country) {
        queryObject.country = { [sequelize_1.default.Op.like]: `%${country}%` };
    }
    if (hobbies) {
        queryObject.hobbies = { [sequelize_1.default.Op.contains]: hobbies };
    }
    let order;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']];
    }
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = User_1.default.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: order,
        attributes: ['id', 'name', 'profilePicture', 'country', 'hobbies']
    });
    const users = yield result;
    const totalUsers = (yield User_1.default.findAll({ where: queryObject })).length;
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ users, totalUsers, numberOfPages });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield User_1.default.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
    if (!user) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getSingleUser = getSingleUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, bio, country, hobbies } = req.body;
    if (name || email || bio || country || hobbies) {
        req.body.password = undefined;
        req.body.profilePicture = undefined;
        // User returns an array of 1 element. We are destructuring that one
        // element. 
        const [numberOfUpdatedAttributes, [user]] = yield User_1.default.update(Object.assign({}, req.body), {
            where: {
                id: req.user.userID
            },
            // Because we are using PostgreSQL we have the ability to use the 
            // returning property. So instead of getting back data like this
            // "user": [0], or "user": [1], where the number inside is the 
            // amount of updates that happened to the user object. We can set 
            // returning to true and the second element in the array will be 
            // the udpated user object. Which is awesome.
            returning: true
        });
        // I know for a fact that the result will have a single user in the array. As
        // we have the unique property set meaning no duplicates for name.
        // Check if Profile Picture Provided
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.profilePicture) {
            const profilePicture = req.files.profilePicture;
            const maxSize = 1000000 * 2;
            if (!profilePicture.mimetype.startsWith('image') || profilePicture.size > maxSize) {
                throw new errors_1.default.BadRequestError('Invalid Profile Picture submission!');
            }
            if (user.profilePicture) {
                const oldImage = user.profilePicture.substring(user.profilePicture.indexOf('WITTY'));
                yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
            }
            const uniqueIdentifierForProfilePicture = new Date().getTime() + '_' + 'profile_picture' + '_' + profilePicture.name;
            const destinationForProfilePicture = node_path_1.default.resolve(__dirname, '../images', uniqueIdentifierForProfilePicture);
            yield profilePicture.mv(destinationForProfilePicture);
            const resultForProfilePicture = yield cloudinary_1.v2.uploader.upload(destinationForProfilePicture, {
                public_id: uniqueIdentifierForProfilePicture,
                folder: 'WITTY-WHIRL/PROFILE_PICTURES'
            });
            yield (0, utils_1.deleteImage)(destinationForProfilePicture);
            user.profilePicture = resultForProfilePicture.secure_url;
            yield user.save();
        }
        const updatedUser = Object.assign({}, user.toJSON());
        delete updatedUser.password;
        return res.status(http_status_codes_1.StatusCodes.OK).json({ user: updatedUser });
    }
    else {
        throw new errors_1.default.BadRequestError('You need to provide atleast 1 thing to update!');
    }
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.default.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (yield User_1.default.findByPk(req.user.userID));
    const isCorrect = yield user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new errors_1.default.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    yield user.save();
    const updatedUser = Object.assign({}, user.toJSON());
    delete updatedUser.password;
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: updatedUser });
});
exports.updateUserPassword = updateUserPassword;
