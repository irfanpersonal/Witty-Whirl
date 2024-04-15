import {IncomingMessage} from "node:http";
import {WebSocketServer} from 'ws';

// Import Web Socket Events for Handling
import getAllChatsEvent from "../webSocketEvents/getAllChatsEvent";
import getAllUsersEvent from "../webSocketEvents/getAllUsersEvent";
import createChatEvent from "../webSocketEvents/createChatEvent";
import getAllMessagesEvent from '../webSocketEvents/getAllMessagesEvent';
import createMessageEvent from '../webSocketEvents/createMessageEvent';

const onConnection = (wss: WebSocketServer) => {
    return (connection: WebSocket, req: IncomingMessage) => {
        // connection is equal to a single Web Socket Connection on our server

        // wss.clients is equal to a set of everyone who is connected to the Web
        // Socket Server
    
        // Set is a data structure similar to an array the only difference being 
        // that it can't hold duplicates, only UNIQUE values
        connection.onmessage = async(event: MessageEvent<any>) => {
            try {
                const eventObject = JSON.parse(event.data);
                if (!eventObject?.eventType) {
                    throw new Error();
                }
                // Handle Events 
                if (eventObject?.eventType === 'getAllChats') {
                    getAllChatsEvent(eventObject, connection, wss);
                }
                else if (eventObject?.eventType === 'getAllUsers') {
                    getAllUsersEvent(eventObject, connection, wss);
                }
                else if (eventObject?.eventType === 'createChat') {
                    createChatEvent(eventObject, connection, wss);
                }
                else if (eventObject?.eventType === 'getAllMessages') {
                    getAllMessagesEvent(eventObject, connection, wss);
                }
                else if (eventObject?.eventType === 'createMessage') {
                    createMessageEvent(eventObject, connection, wss);
                }
            }
            catch(error) {
                connection.send(JSON.stringify('Unsupported Event'));
            }
        }
    }
}

export default onConnection;