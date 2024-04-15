import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {type MessageType} from '../features/message/messageSlice';
import {useSelector} from 'react-redux';
import {type useSelectorType} from '../store';

interface MessageListItemProps {
    data: MessageType
}

const MessageListItem: React.FunctionComponent<MessageListItemProps> = ({data}) => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    return (
        <Wrapper>
            {user!.id === data.senderId ? (
                // If its your message
                <div className="right-side">
                    <div className="message-content">
                        <div className="right">{data.text}</div>
                        <div className="right">{data.sender.name}</div>
                    </div>
                    <img src={data.sender.profilePicture || emptyProfilePicture} alt={data.sender.name}/>
                </div>
            ) : (
                // If its not your message
                <div className="left-side">
                    <img src={data.sender.profilePicture || emptyProfilePicture} alt={data.sender.name}/>
                    <div className="message-content">
                        <div className="left">{data.text}</div>
                        <div className="left">{data.sender.name}</div>
                    </div>
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-bottom: 1rem;
    .right-side, .left-side {
        display: flex;
        align-items: center;
        gap: 1rem;
        img {
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            outline: 1px solid black;
        }
        .message-content {
            background-color: #e1f7e7;
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-right: 0.5rem;
            text-align: right;
            .left {
                text-align: left;
            }
            .right {
                text-align: right;
            }
        }
    }
    .right-side {
        justify-content: flex-end;
    }
    .left-side {
        justify-content: flex-start;
    }
    .right-side div, .left-side div {
        font-size: 0.85rem;
    }
    .message-content div:last-child {
        font-size: 0.75rem;
        color: gray;    
    }
`;

export default MessageListItem;