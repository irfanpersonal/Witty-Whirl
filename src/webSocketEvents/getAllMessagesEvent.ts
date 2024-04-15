import {getAllMessagesForSingleChat} from '../controllers/messageWS';
import {type EventObjectType} from '../webSocketEvents';
import {type WebSocketServer} from 'ws';

const createChatEvent = async(eventObject: EventObjectType, connection: WebSocket, wss: WebSocketServer) => {
    const data = eventObject.data;
    const {
        messages,
        totalMessages,
        numberOfPages,
        msg
    } = await getAllMessagesForSingleChat(connection, data.page, data.limit, data.chatId);
    if (msg) {
        // Yes Error
        connection.send(JSON.stringify({
            eventType: 'error',
            data: {msg}
        }));
    }
    else {
        // No Error
        connection.send(JSON.stringify({
            eventType: 'getAllMessages', 
            data: {
                messages, 
                totalMessages,
                numberOfPages
            }
        }));
    }
}

export default createChatEvent;