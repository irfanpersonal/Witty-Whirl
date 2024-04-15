import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app: express.Express = express();
import './database/connect';
import {notFoundMiddleware, errorHandlerMiddleware} from './middleware';
import {authRouter, userRouter} from './routers';
import {onServerUpgrade, onConnection} from './webSocketHandlers';

import ws from 'ws';
import fileUpload from 'express-fileupload';
import {v2 as cloudinary} from 'cloudinary';
import cookieParser from 'cookie-parser';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import path from 'node:path';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

app.use(fileUpload());

app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/user', userRouter);

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get('*', (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).sendFile(path.resolve(__dirname, './client/build/index.html'));
});

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port: number = Number(process.env.PORT) || 4000;
const start = async() => {
    try {
        // During creation of a Web Socket Server, I have two options,
        // either I tie it to a HTTP server or not. The main difference 
        // between this is that tieing a HTTP server to the Web Socket 
        // Server makes it so that the upgrading (converting regular
        // http request to a web socket connection) happens automatically.
        // But if I don't tie it to a HTTP server I have to manually upgrade 
        // from regular HTTP request to web socket connection. 
        const wss = new ws.WebSocketServer({noServer: true}); // I didn't tie
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
        server.on('upgrade', onServerUpgrade(wss));
        wss.on('connection', onConnection(wss));
    }
    catch(error) {
        console.log(error);
    }
}

start();