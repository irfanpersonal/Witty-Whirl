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
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("./database/connect");
const middleware_1 = require("./middleware");
const routers_1 = require("./routers");
const webSocketHandlers_1 = require("./webSocketHandlers");
const ws_1 = __importDefault(require("ws"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cloudinary_1 = require("cloudinary");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_status_codes_1 = require("http-status-codes");
const node_path_1 = __importDefault(require("node:path"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
app.use((0, express_fileupload_1.default)());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use(express_1.default.json());
app.use('/api/v1/auth', routers_1.authRouter);
app.use('/api/v1/user', routers_1.userRouter);
app.use(express_1.default.static(node_path_1.default.resolve(__dirname, './client/build')));
app.get('*', (req, res) => {
    return res.status(http_status_codes_1.StatusCodes.OK).sendFile(node_path_1.default.resolve(__dirname, './client/build/index.html'));
});
app.use(middleware_1.notFoundMiddleware);
app.use(middleware_1.errorHandlerMiddleware);
const port = Number(process.env.PORT) || 4000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // During creation of a Web Socket Server, I have two options,
        // either I tie it to a HTTP server or not. The main difference 
        // between this is that tieing a HTTP server to the Web Socket 
        // Server makes it so that the upgrading (converting regular
        // http request to a web socket connection) happens automatically.
        // But if I don't tie it to a HTTP server I have to manually upgrade 
        // from regular HTTP request to web socket connection. 
        const wss = new ws_1.default.WebSocketServer({ noServer: true }); // I didn't tie
        // the Web Socket Server to a HTTP Server
        // This is how you tie a Web Socket Server to a HTTP Server
        // const wss = new ws.WebSocketServer({server});
        const server = app.listen(port, () => {
            // This is a HTTP Server
            console.log(`Server listening on port ${port}...`);
        });
        // The server.on('upgrade') function runs when a regular HTTP 
        // Request is sent to the HTTP server with the following headers 
        // Upgrade Header = any value
        // Connection Header = upgrade
        server.on('upgrade', (0, webSocketHandlers_1.onServerUpgrade)(wss));
        wss.on('connection', (0, webSocketHandlers_1.onConnection)(wss));
    }
    catch (error) {
        console.log(error);
    }
});
start();
