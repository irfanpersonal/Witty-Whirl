"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const utils_1 = require("../utils");
const onServerUpgrade = (wss) => {
    return (req, socket, head) => {
        // By default if you tied your Web Socket Server to a HTTP Server 
        // you don't need to add any logic here. The HTTP Request
        // will turn into a Web Socket Connection automatically. But
        // in this case because were not tieing a HTTP Server to our Web
        // Socket Server, it WON'T automatically convert the regular 
        // HTTP Request to a Web Socket Connection. 
        var _a, _b, _c;
        // So in our case, in order for the regular HTTP Request to 
        // be upgraded to a Web Socket connection all we have to do 
        // is invoke the wss.handleUpgrade method and inside of it 
        // invoke the wss.emit function with 'connection', and pass 
        // in ws and req. Failure to do this will result in hanging
        // behavior. 
        const cookieObject = {};
        (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie) === null || _b === void 0 ? void 0 : _b.split('; ')) === null || _c === void 0 ? void 0 : _c.forEach((cookie) => {
            const [key, value] = cookie.split("=");
            // Because the value of a cookie is encoded we use the 
            // decodeURIComponent function to decode it so we can 
            // use it.
            cookieObject[key] = decodeURIComponent(value);
        });
        const token = cookieObject === null || cookieObject === void 0 ? void 0 : cookieObject.token;
        if (token) {
            const unsignedCookie = cookie_parser_1.default.signedCookie(token, process.env.JWT_SECRET);
            const decoded = (0, utils_1.verifyToken)(unsignedCookie);
            // We use the handleUpgrade(req, socket, head, (ws) => {}) 
            // function to give us the option to create a Web Socket 
            // connection.
            wss.handleUpgrade(req, socket, head, (ws) => {
                // To add the decoded token value to the Web Socket Connection 
                // simply append it to the ws.
                ws.user = decoded;
                // Remember just invoking the handleUpgrade isn't enough. We
                // also have to invoke the .emit method and pass in ws and req.
                wss.emit('connection', ws, req);
            });
        }
        else {
            // If no token is provided when attempting to create a Web Socket
            // Connection we will throw back an Unauthorized Error
            const responseHeaders = [
                'HTTP/1.1 401 Unauthorized', // HTTP Version | HTTP Status Code | HTTP Status Message
                '\r\n'
            ];
            socket.write(responseHeaders.join('\r\n'));
            socket.destroy(); // This method means: No Access.
        }
    };
};
exports.default = onServerUpgrade;
