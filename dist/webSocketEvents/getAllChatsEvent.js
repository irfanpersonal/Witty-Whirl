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
const chatWS_1 = require("../controllers/chatWS");
const getAllChatsEvent = (eventObject, connection, wss) => __awaiter(void 0, void 0, void 0, function* () {
    const data = eventObject.data;
    const { chats, totalChats, numberOfPages, msg } = yield (0, chatWS_1.getAllChats)(connection, data.page, data.limit);
    if (msg) {
        // What to do if we GET an error
        connection.send(JSON.stringify({
            eventType: 'error',
            data: { msg }
        }));
    }
    else {
        // What ot do if DONT get an error
        connection.send(JSON.stringify({
            eventType: 'getAllChats',
            data: {
                chats,
                totalChats,
                numberOfPages
            }
        }));
    }
});
exports.default = getAllChatsEvent;
