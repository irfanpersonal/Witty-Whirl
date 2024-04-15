import {createChat} from '../controllers/chatWS';
import {type EventObjectType} from '../webSocketEvents';
import {type WebSocketServer} from 'ws';

const createChatEvent = async(eventObject: EventObjectType, connection: WebSocket, wss: WebSocketServer) => {
    const data = eventObject.data;
    const {
        chat, 
        msg
    } = await createChat(connection, data.id);
    if (msg) {
        // What to do if we GET an error
        connection.send(JSON.stringify({
            eventType: 'error',
            data: {msg}
        }));
    }
    else {
        // What to do if NO error
        connection.send(JSON.stringify({
            eventType: 'createChat', 
            data: {
                chat
            }
        }));
    }
}

export default createChatEvent;