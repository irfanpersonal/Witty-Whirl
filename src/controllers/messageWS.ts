import Message from '../database/models/Message';
import User from '../database/models/User';
import Chat from '../database/models/Chat';
import Sequelize from 'sequelize';

const createMessage = async(connection: WebSocket, chatId: string, text: string) => {
    const userID = (connection as any).user.userID;
    const chat = await Chat.findOne({
        where: {
            id: chatId,
            [Sequelize.Op.or]: [
                {
                    creatorId: userID
                },
                {
                    recipientToMessageId: userID
                }
            ]
        }
    });
    if (!chat) {
        return {msg: 'No Chat Found with the ID Provided!'};
    }
    const inputData = {
        senderId: userID,
        chatId: chatId,
        text: text
    };
    const message = await Message.create(inputData as any);
    const messageWithChatAndSender = await Message.findByPk(message.id, {
        include: [
            {
                model: User,
                as: 'sender',
                attributes: ['name', 'profilePicture']
            },
            {
                model: Chat,
                as: 'chat',
                attributes: ['recipientToMessageId', 'creatorId']
            }
        ]
    });
    return {message: messageWithChatAndSender};
}

const getAllMessagesForSingleChat = async(connection: WebSocket, page: number, limit: number, chatId: string) => {
    const userID = (connection as any).user.userID;
    const chat = (await Chat.findByPk(chatId))!;
    if (!chat) {
        return {msg: 'No Chat Found with the ID Provided!'};
    }
    const membersOfChat = [chat.creatorId, chat.recipientToMessageId];
    if (!membersOfChat.includes(userID)) {
        return {msg: 'You cannot view messages from a chat you are not part of!'};
    }
    const queryObjectOuter = {
        chatId: chatId
    }
    const skip = (page - 1) * limit;
    let result = Message.findAll({
        where: queryObjectOuter,
        offset: skip, 
        limit: limit,
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                as: 'sender',
                attributes: ['name', 'profilePicture']
            },
            {
                model: Chat,
                as: 'chat',
                attributes: ['recipientToMessageId', 'creatorId']
            }
        ]
    });
    const messages = await result;
    const totalMessages = (await Message.findAll({where: queryObjectOuter})).length;
    const numberOfPages = Math.ceil(totalMessages / limit);
    return {messages, totalMessages, numberOfPages};
}

export {
    createMessage, 
    getAllMessagesForSingleChat
};