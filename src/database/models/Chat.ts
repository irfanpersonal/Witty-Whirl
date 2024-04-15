import {
    Model, Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, HasMany, AfterDestroy
} from 'sequelize-typescript';
import User from './User';
import Message from './Message';

export interface IChat {
    id: string,
    recipientToMessageId: string,
    creatorId: string,
    creator: User,
    createdAt: Date,
    updatedAt: Date
}

@Table({
    modelName: 'Chat',
    tableName: 'chats',
    freezeTableName: true,
    timestamps: true
})
class Chat extends Model<IChat> {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;
    @Column({
        type: DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare recipientToMessageId: string;
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare creatorId: string;
    @BelongsTo(() => User)
    declare creator: User;
    @HasMany(() => Message)
    declare messages: Message[];
    @CreatedAt
    declare createdAt: Date;
    @UpdatedAt
    declare updatedAt: Date;
    @AfterDestroy
    static deleteAllMessagesConnectedToThisChat = async(instance: Chat) => {
        await Message.destroy({
            where: {
                chatId: instance.id
            }
        });
    }
}

export default Chat;