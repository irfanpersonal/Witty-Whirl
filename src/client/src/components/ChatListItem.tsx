import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {type ChatType, setSelectedChat} from '../features/chat/chatSlice';
import {reset} from '../features/message/messageSlice';

interface ChatListItemProps {
    data: ChatType
}

const ChatListItem: React.FunctionComponent<ChatListItemProps> = ({data}) => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {selectedChat} = useSelector((store: useSelectorType) => store.chat);
    return (
        <Wrapper>
            <div className={`chat-list-item ${selectedChat === data.id && 'selected'}`} onClick={() => {
                if (selectedChat === data.id) {
                    dispatch(reset());
                    dispatch(setSelectedChat(''));
                    return;
                }
                dispatch(setSelectedChat(data.id));
            }}>
                {user!.id === data.creatorId ? (
                    <>
                        <Link to={`/profile/${data.recipientToMessageId}`}><img src={data.recipientToMessage.profilePicture || emptyProfilePicture}/></Link>
                        <div>{data.recipientToMessage.name}</div>
                    </>
                ) : (
                    <>
                        <Link to={`/profile/${data.creatorId}`}><img src={data.creator.profilePicture || emptyProfilePicture}/></Link>
                        <div>{data.creator.name}</div>
                    </>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    margin-bottom: 1rem;
    .selected {
        background-color: rgb(178, 179, 119);
    }
    .chat-list-item {
        outline: 1px solid black;
        padding: 0.5rem;
        text-align: center;
        user-select: none;
        cursor: pointer;
        img {
            width: 3rem;
            height: 3rem;
            border: 1px solid black;
            border-radius: 50%;
        }
        .online {
            border: 0.5rem solid green;
        }
        .offline {
            border: 0.5rem solid red;
        }
    }
`;

export default ChatListItem;