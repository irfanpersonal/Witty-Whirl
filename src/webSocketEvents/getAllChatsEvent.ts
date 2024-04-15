import {getAllChats} from '../controllers/chatWS';
import {type EventObjectType} from '../webSocketEvents';
import {type WebSocketServer} from 'ws';

const getAllChatsEvent = async(eventObject: EventObjectType, connection: WebSocket, wss: WebSocketServer) => {
    const data = eventObject.data;
    const {
        chats, 
        totalChats, 
        numberOfPages,
        msg
    } = await getAllChats(connection, data.page, data.limit);
    if (msg) {
        // What to do if we GET an error
        connection.send(JSON.stringify({
            eventType: 'error',
            data: {msg}
        }));
    }
    else {
        // What ot do if DONT get an error
        connection.send(JSON.stringify({
            eventType: 'getAllChats', 
            data: {
                chats, 
                totalChats, 
                numberOfPages
            }
        }));
    }
}

export default getAllChatsEvent;