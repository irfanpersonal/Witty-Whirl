import Chat, {IChat} from '../database/models/Chat';
import CustomError from '../errors';
import Sequelize from 'sequelize';
import User from '../database/models/User';
import {isUUID} from 'validator';

const getAllChats = async(connection: WebSocket, page: number, limit: number) => {
    if (!page || !limit) {
        return ({msg: 'Please provide page and limit!'});
    }
    const userID = (connection as any).user!.userID;
    const queryObjectOuter = {
        [Sequelize.Op.or]: [
            {
                creatorId: userID
            },
            {
                recipientToMessageId: userID
            }
        ]
    };
    const skip = (page - 1) * limit;
    let result = Chat.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['name', 'profilePicture']
            }
        ]
    });
    const chats = await result;
    const processedChats = [];
    for (let i = 0; i < chats.length; i++) {
        const chatJSON = chats[i].toJSON();
        const recipientToMessageId = chatJSON.recipientToMessageId;
        const foundUser = (await User.findByPk(recipientToMessageId))!;
        processedChats.push({
            id: chatJSON.id,
            recipientToMessageId: chatJSON.recipientToMessageId,
            recipientToMessage: {name: foundUser.name, profilePicture: foundUser.profilePicture},
            creatorId: chatJSON.creatorId,
            creator: chatJSON.creator,
            createdAt: chatJSON.createdAt,
            updatedAt: chatJSON.updatedAt
        });
    }
    const totalChats = (await Chat.findAll({where: queryObjectOuter})).length;
    const numberOfPages = Math.ceil(totalChats / limit);
    return ({chats: processedChats, totalChats, numberOfPages});
}

const getSingleChat = async(userID: string, chatID: string) => {
    const chat = await Chat.findOne({
        where: {
            id: chatID,
            [Sequelize.Op.or]: [
                {
                    creatorId: userID
                },
                {
                    recipientToMessageId: userID
                }
            ]
        },
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['name', 'profilePicture']
            }
        ]
    });
    if (!chat) {
        throw new CustomError.NotFoundError('No Chat Found with the ID Provided!');
    }
    return {chat};
}

const createChat = async(connection: WebSocket, recipientToMessageId: string) => {
    const userID = (connection as any).user!.userID;
    let invalidUser: boolean = false;
    if (recipientToMessageId === userID) {
        return ({msg: 'You cannot create a chat with yourself!'});
    }
    if (!recipientToMessageId) {
        return ({msg: 'Please provide recipientToMessageId!'});
    }
    if (isUUID(recipientToMessageId || '')) {
        const foundUser = await User.findByPk(recipientToMessageId);
        if (!foundUser) {
            invalidUser = true;
        }
    }
    if (!isUUID(recipientToMessageId) || invalidUser) {
        return ({msg: 'Please provide a valid recipientToMessageId!'});
    }
    // If a Chat already exists between these two Users throw an error
    const thisChatAlreadyExists = await Chat.findOne({
        where: {
            [Sequelize.Op.or]: [
                {
                    creatorId: userID,
                    recipientToMessageId: recipientToMessageId
                },
                {
                    creatorId: recipientToMessageId,
                    recipientToMessageId: userID
                }
            ]
            
        }
    });
    if (thisChatAlreadyExists) {
        return ({msg: 'This chat already exists between you two!'});
    }
    const chat = await Chat.create({
        creatorId: userID,
        recipientToMessageId
    } as any);
    return {chat};
}

const deleteChat = async(userID: string, chatId: string) => {
    const chat = await Chat.findOne({
        where: {
            id: chatId,
            creatorId: userID
        }
    });
    if (!chat) {
        throw new CustomError.NotFoundError('No Chat Found with the ID Provided!');
    }
    await chat.destroy();
    return {msg: 'Deleted Chat'};
}

export {
    getAllChats,
    getSingleChat,
    createChat,
    deleteChat
};