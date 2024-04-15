"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = exports.errorHandlerMiddleware = exports.authentication = void 0;
const authentication_1 = require("./authentication");
Object.defineProperty(exports, "authentication", { enumerable: true, get: function () { return authentication_1.authentication; } });
const error_handler_1 = __importDefault(require("./error-handler"));
exports.errorHandlerMiddleware = error_handler_1.default;
const not_found_1 = __importDefault(require("./not-found"));
exports.notFoundMiddleware = not_found_1.default;
