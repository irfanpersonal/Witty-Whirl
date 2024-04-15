import {createMessage} from '../controllers/messageWS';
import {type EventObjectType} from '../webSocketEvents';
import {type WebSocketServer} from 'ws';
import { CustomWebSocket } from '../webSocketHandlers/onServerUpgrade';

const createChatEvent = async(eventObject: EventObjectType, connection: WebSocket, wss: WebSocketServer) => {
    const data = eventObject.data;
    const {
        message,
        msg
    } = await createMessage(connection, data.chatId, data.text);
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
            eventType: 'createMessage', 
            data: {
                message
            }
        }));
        // Notify Recipient if Online that they got a message
        const recipientId = message!.senderId === message!.chat.creatorId ? message!.chat.recipientToMessageId : message!.chat.creatorId;
        let recipient = null;
        for (let i = 0; i < [...wss.clients].length; i++) {
            const client = [...wss.clients][i] as unknown as CustomWebSocket;
            if (client.user!.userID === recipientId) {
                recipient = client;
                break;
            }
        }
        if (recipient) {
            recipient.send(JSON.stringify({
                eventType: 'new_message_data', 
                data: {
                    message
                }
            }));
        }
    }
}

export default createChatEvent;