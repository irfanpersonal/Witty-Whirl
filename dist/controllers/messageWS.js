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
exports.getAllMessagesForSingleChat = exports.createMessage = void 0;
const Message_1 = __importDefault(require("../database/models/Message"));
const User_1 = __importDefault(require("../database/models/User"));
const Chat_1 = __importDefault(require("../database/models/Chat"));
const sequelize_1 = __importDefault(require("sequelize"));
const createMessage = (connection, chatId, text) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = connection.user.userID;
    const chat = yield Chat_1.default.findOne({
        where: {
            id: chatId,
            [sequelize_1.default.Op.or]: [
                {
                    creatorId: userID
                },
                {
                    recipientToMessageId: userID
                }
            ]
        }
    });
    if (!chat) {
        return { msg: 'No Chat Found with the ID Provided!' };
    }
    const inputData = {
        senderId: userID,
        chatId: chatId,
        text: text
    };
    const message = yield Message_1.default.create(inputData);
    const messageWithChatAndSender = yield Message_1.default.findByPk(message.id, {
        include: [
            {
                model: User_1.default,
                as: 'sender',
                attributes: ['name', 'profilePicture']
            },
            {
                model: Chat_1.default,
                as: 'chat',
                attributes: ['recipientToMessageId', 'creatorId']
            }
        ]
    });
    return { message: messageWithChatAndSender };
});
exports.createMessage = createMessage;
const getAllMessagesForSingleChat = (connection, page, limit, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = connection.user.userID;
    const chat = (yield Chat_1.default.findByPk(chatId));
    if (!chat) {
        return { msg: 'No Chat Found with the ID Provided!' };
    }
    const membersOfChat = [chat.creatorId, chat.recipientToMessageId];
    if (!membersOfChat.includes(userID)) {
        return { msg: 'You cannot view messages from a chat you are not part of!' };
    }
    const queryObjectOuter = {
        chatId: chatId
    };
    const skip = (page - 1) * limit;
    let result = Message_1.default.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User_1.default,
                as: 'sender',
                attributes: ['name', 'profilePicture']
            },
            {
                model: Chat_1.default,
                as: 'chat',
                attributes: ['recipientToMessageId', 'creatorId']
            }
        ]
    });
    const messages = yield result;
    const totalMessages = (yield Message_1.default.findAll({ where: queryObjectOuter })).length;
    const numberOfPages = Math.ceil(totalMessages / limit);
    return { messages, totalMessages, numberOfPages };
});
exports.getAllMessagesForSingleChat = getAllMessagesForSingleChat;
