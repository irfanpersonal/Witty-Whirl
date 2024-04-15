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
exports.deleteChat = exports.createChat = exports.getSingleChat = exports.getAllChats = void 0;
const Chat_1 = __importDefault(require("../database/models/Chat"));
const errors_1 = __importDefault(require("../errors"));
const sequelize_1 = __importDefault(require("sequelize"));
const User_1 = __importDefault(require("../database/models/User"));
const validator_1 = require("validator");
const getAllChats = (connection, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (!page || !limit) {
        return ({ msg: 'Please provide page and limit!' });
    }
    const userID = connection.user.userID;
    const queryObjectOuter = {
        [sequelize_1.default.Op.or]: [
            {
                creatorId: userID
            },
            {
                recipientToMessageId: userID
            }
        ]
    };
    const skip = (page - 1) * limit;
    let result = Chat_1.default.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        include: [
            {
                model: User_1.default,
                as: 'creator',
                attributes: ['name', 'profilePicture']
            }
        ]
    });
    const chats = yield result;
    const processedChats = [];
    for (let i = 0; i < chats.length; i++) {
        const chatJSON = chats[i].toJSON();
        const recipientToMessageId = chatJSON.recipientToMessageId;
        const foundUser = (yield User_1.default.findByPk(recipientToMessageId));
        processedChats.push({
            id: chatJSON.id,
            recipientToMessageId: chatJSON.recipientToMessageId,
            recipientToMessage: { name: foundUser.name, profilePicture: foundUser.profilePicture },
            creatorId: chatJSON.creatorId,
            creator: chatJSON.creator,
            createdAt: chatJSON.createdAt,
            updatedAt: chatJSON.updatedAt
        });
    }
    const totalChats = (yield Chat_1.default.findAll({ where: queryObjectOuter })).length;
    const numberOfPages = Math.ceil(totalChats / limit);
    return ({ chats: processedChats, totalChats, numberOfPages });
});
exports.getAllChats = getAllChats;
const getSingleChat = (userID, chatID) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield Chat_1.default.findOne({
        where: {
            id: chatID,
            [sequelize_1.default.Op.or]: [
                {
                    creatorId: userID
                },
                {
                    recipientToMessageId: userID
                }
            ]
        },
        include: [
            {
                model: User_1.default,
                as: 'creator',
                attributes: ['name', 'profilePicture']
            }
        ]
    });
    if (!chat) {
        throw new errors_1.default.NotFoundError('No Chat Found with the ID Provided!');
    }
    return { chat };
});
exports.getSingleChat = getSingleChat;
const createChat = (connection, recipientToMessageId) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = connection.user.userID;
    let invalidUser = false;
    if (recipientToMessageId === userID) {
        return ({ msg: 'You cannot create a chat with yourself!' });
    }
    if (!recipientToMessageId) {
        return ({ msg: 'Please provide recipientToMessageId!' });
    }
    if ((0, validator_1.isUUID)(recipientToMessageId || '')) {
        const foundUser = yield User_1.default.findByPk(recipientToMessageId);
        if (!foundUser) {
            invalidUser = true;
        }
    }
    if (!(0, validator_1.isUUID)(recipientToMessageId) || invalidUser) {
        return ({ msg: 'Please provide a valid recipientToMessageId!' });
    }
    // If a Chat already exists between these two Users throw an error
    const thisChatAlreadyExists = yield Chat_1.default.findOne({
        where: {
            [sequelize_1.default.Op.or]: [
                {
                    creatorId: userID,
                    recipientToMessageId: recipientToMessageId
                },
                {
                    creatorId: recipientToMessageId,
                    recipientToMessageId: userID
                }
            ]
        }
    });
    if (thisChatAlreadyExists) {
        return ({ msg: 'This chat already exists between you two!' });
    }
    const chat = yield Chat_1.default.create({
        creatorId: userID,
        recipientToMessageId
    });
    return { chat };
});
exports.createChat = createChat;
const deleteChat = (userID, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield Chat_1.default.findOne({
        where: {
            id: chatId,
            creatorId: userID
        }
    });
    if (!chat) {
        throw new errors_1.default.NotFoundError('No Chat Found with the ID Provided!');
    }
    yield chat.destroy();
    return { msg: 'Deleted Chat' };
});
exports.deleteChat = deleteChat;
