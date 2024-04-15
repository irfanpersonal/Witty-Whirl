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
// Import Web Socket Events for Handling
const getAllChatsEvent_1 = __importDefault(require("../webSocketEvents/getAllChatsEvent"));
const getAllUsersEvent_1 = __importDefault(require("../webSocketEvents/getAllUsersEvent"));
const createChatEvent_1 = __importDefault(require("../webSocketEvents/createChatEvent"));
const getAllMessagesEvent_1 = __importDefault(require("../webSocketEvents/getAllMessagesEvent"));
const createMessageEvent_1 = __importDefault(require("../webSocketEvents/createMessageEvent"));
const onConnection = (wss) => {
    return (connection, req) => {
        // connection is equal to a single Web Socket Connection on our server
        // wss.clients is equal to a set of everyone who is connected to the Web
        // Socket Server
        // Set is a data structure similar to an array the only difference being 
        // that it can't hold duplicates, only UNIQUE values
        connection.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const eventObject = JSON.parse(event.data);
                if (!(eventObject === null || eventObject === void 0 ? void 0 : eventObject.eventType)) {
                    throw new Error();
                }
                // Handle Events 
                if ((eventObject === null || eventObject === void 0 ? void 0 : eventObject.eventType) === 'getAllChats') {
                    (0, getAllChatsEvent_1.default)(eventObject, connection, wss);
                }
                else if ((eventObject === null || eventObject === void 0 ? void 0 : eventObject.eventType) === 'getAllUsers') {
                    (0, getAllUsersEvent_1.default)(eventObject, connection, wss);
                }
                else if ((eventObject === null || eventObject === void 0 ? void 0 : eventObject.eventType) === 'createChat') {
                    (0, createChatEvent_1.default)(eventObject, connection, wss);
                }
                else if ((eventObject === null || eventObject === void 0 ? void 0 : eventObject.eventType) === 'getAllMessages') {
                    (0, getAllMessagesEvent_1.default)(eventObject, connection, wss);
                }
                else if ((eventObject === null || eventObject === void 0 ? void 0 : eventObject.eventType) === 'createMessage') {
                    (0, createMessageEvent_1.default)(eventObject, connection, wss);
                }
            }
            catch (error) {
                connection.send(JSON.stringify('Unsupported Event'));
            }
        });
    };
};
exports.default = onConnection;
