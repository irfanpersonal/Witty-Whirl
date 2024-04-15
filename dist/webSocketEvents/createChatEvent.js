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
const createChatEvent = (eventObject, connection, wss) => __awaiter(void 0, void 0, void 0, function* () {
    const data = eventObject.data;
    const { chat, msg } = yield (0, chatWS_1.createChat)(connection, data.id);
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
            eventType: 'createChat',
            data: {
                chat
            }
        }));
    }
});
exports.default = createChatEvent;
