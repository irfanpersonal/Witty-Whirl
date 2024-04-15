"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onConnection = exports.onServerUpgrade = void 0;
const onServerUpgrade_1 = __importDefault(require("./onServerUpgrade"));
exports.onServerUpgrade = onServerUpgrade_1.default;
const onConnection_1 = __importDefault(require("./onConnection"));
exports.onConnection = onConnection_1.default;
