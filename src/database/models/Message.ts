import {
    Model, Table, Column, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey
} from 'sequelize-typescript';
import Chat from './Chat';
import User from './User';

export interface IMessage {
    id: string,
    chatId: string,
    chat: Chat,
    senderId: string,
    sender: User,
    text: string,
    createdAt: Date,
    updatedAt: Date
}

@Table({
    modelName: 'Message',
    tableName: 'messages',
    freezeTableName: true,
    timestamps: true
})
class Message extends Model<IMessage> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;
    @ForeignKey(() => Chat)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare chatId: string;
    @BelongsTo(() => Chat)
    declare chat: Chat;
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare senderId: string;
    @BelongsTo(() => User)
    declare sender: User;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare text: string;
    @CreatedAt
    declare createdAt: Date;
    @UpdatedAt
    declare updatedAt: Date;
}

export default Message;