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
exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../database/models/User"));
const sequelize_1 = __importDefault(require("sequelize"));
const getAllUsers = (connection, queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, country, hobbies, sort } = queryData;
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
    const page = Number(queryData.page) || 1;
    const limit = Number(queryData.limit) || 10;
    const skip = (page - 1) * limit;
    let result = User_1.default.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'profilePicture', 'country', 'hobbies']
    });
    const users = yield result;
    const totalUsers = (yield User_1.default.findAll({ where: queryObject })).length;
    const numberOfPages = Math.ceil(totalUsers / limit);
    return ({ users, totalUsers, numberOfPages });
});
exports.getAllUsers = getAllUsers;
