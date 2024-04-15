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
Object.defineProperty(exports, "__esModule", { value: true });
const messageWS_1 = require("../controllers/messageWS");
const createChatEvent = (eventObject, connection, wss) => __awaiter(void 0, void 0, void 0, function* () {
    const data = eventObject.data;
    const { message, msg } = yield (0, messageWS_1.createMessage)(connection, data.chatId, data.text);
    if (msg) {
        // What to do if we GET an error
        connection.send(JSON.stringify({
            eventType: 'error',
            data: { msg }
        }));
    }
    else {
        // What to do if NO error
        connection.send(JSON.stringify({
            eventType: 'createMessage',
            data: {
                message
            }
        }));
        // Notify Recipient if Online that they got a message
        const recipientId = message.senderId === message.chat.creatorId ? message.chat.recipientToMessageId : message.chat.creatorId;
        let recipient = null;
        for (let i = 0; i < [...wss.clients].length; i++) {
            const client = [...wss.clients][i];
            if (client.user.userID === recipientId) {
                recipient = client;
                break;
            }
        }
        if (recipient) {
            recipient.send(JSON.stringify({
                eventType: 'new_message_data',
                data: {
                    message
                }
            }));
        }
    }
});
exports.default = createChatEvent;
