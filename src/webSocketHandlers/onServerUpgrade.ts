import cookieParser from 'cookie-parser';
import {WebSocketServer} from 'ws';
import {ITokenPayload, verifyToken} from '../utils';
import {IncomingMessage} from 'http';

export interface CustomWebSocket extends WebSocket {
    user?: ITokenPayload
}

const onServerUpgrade = (wss: WebSocketServer) => {
    return (req: IncomingMessage, socket: any, head: Buffer) => {
        // By default if you tied your Web Socket Server to a HTTP Server 
        // you don't need to add any logic here. The HTTP Request
        // will turn into a Web Socket Connection automatically. But
        // in this case because were not tieing a HTTP Server to our Web
        // Socket Server, it WON'T automatically convert the regular 
        // HTTP Request to a Web Socket Connection. 
        
        // So in our case, in order for the regular HTTP Request to 
        // be upgraded to a Web Socket connection all we have to do 
        // is invoke the wss.handleUpgrade method and inside of it 
        // invoke the wss.emit function with 'connection', and pass 
        // in ws and req. Failure to do this will result in hanging
        // behavior. 
        const cookieObject: {[key: string]: any} = {};
        req.headers?.cookie!?.split('; ')?.forEach((cookie: string) => {
            const [key, value] = cookie.split("=");
            // Because the value of a cookie is encoded we use the 
            // decodeURIComponent function to decode it so we can 
            // use it.
            cookieObject[key] = decodeURIComponent(value);
        });
        const token = cookieObject?.token;
        if (token) {
            const unsignedCookie = cookieParser.signedCookie(token, process.env.JWT_SECRET!) as string;
            const decoded = verifyToken(unsignedCookie);
            // We use the handleUpgrade(req, socket, head, (ws) => {}) 
            // function to give us the option to create a Web Socket 
            // connection.
            wss.handleUpgrade(req, socket, head, (ws) => {
                // To add the decoded token value to the Web Socket Connection 
                // simply append it to the ws.
                (ws as unknown as CustomWebSocket).user = decoded;
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
    }
}

export default onServerUpgrade;