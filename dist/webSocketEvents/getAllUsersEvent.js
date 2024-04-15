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
const userWS_1 = require("../controllers/userWS");
const getAllUsersEvent = (eventObject, connection, wss) => __awaiter(void 0, void 0, void 0, function* () {
    const data = eventObject.data;
    const { users, totalUsers, numberOfPages } = yield (0, userWS_1.getAllUsers)(connection, data.queryData);
    connection.send(JSON.stringify({
        eventType: 'getAllUsers',
        data: {
            users,
            totalUsers,
            numberOfPages
        }
    }));
});
exports.default = getAllUsersEvent;
