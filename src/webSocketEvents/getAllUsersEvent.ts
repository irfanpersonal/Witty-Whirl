import {getAllUsers} from '../controllers/userWS';
import {type EventObjectType} from '../webSocketEvents';
import {type WebSocketServer} from 'ws';

const getAllUsersEvent = async(eventObject: EventObjectType, connection: WebSocket, wss: WebSocketServer) => {
    const data = eventObject.data;
    const {
        users,
        totalUsers,
        numberOfPages
    } = await getAllUsers(connection, data.queryData);
    connection.send(JSON.stringify({
        eventType: 'getAllUsers', 
        data: {
            users,
            totalUsers,
            numberOfPages
        }
    }));
}

export default getAllUsersEvent;