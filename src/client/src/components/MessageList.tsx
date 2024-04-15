import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, MessageListItem, PaginationBox} from '../components';
import {setMessages, setTotalMessages, setNumberOfPages, setGetAllChatMessagesLoading, setPage, addMessage} from '../features/message/messageSlice';
import {nanoid} from 'nanoid';
import {SocketContext} from '../pages/Home';

const MessageList: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {selectedChat} = useSelector((store: useSelectorType) => store.chat);
    const {getAllChatMessagesLoading, messages, totalMessages, numberOfPages, page} = useSelector((store: useSelectorType) => store.message);
    const socket = React.useContext(SocketContext);
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const [initialRender, setInitialRender] = React.useState<boolean>(true);
    const [scrolledToBottom, setScrolledToBottom] = React.useState<boolean>(false);
    React.useEffect(() => {
        socket!.send(JSON.stringify({
            eventType: 'getAllMessages',
            data: {
                page: page,
                limit: 10,
                chatId: selectedChat
            }
        }));
        const handleMessageEvent = (event: MessageEvent<any>) => { 
            const {eventType, data} = JSON.parse(event.data);
            if (eventType === 'getAllMessages') {
                const reversedMessages = data.messages.map((value: object, index: number, array: object[]) => {
                    return data.messages[array.length - index - 1];
                });
                dispatch(setMessages(reversedMessages));
                dispatch(setTotalMessages(data.totalMessages));
                dispatch(setNumberOfPages(data.numberOfPages));
                dispatch(setGetAllChatMessagesLoading(false));
            }
            else if (eventType === 'createMessage') {
                dispatch(addMessage(data.message));
                (document.querySelector('#message') as HTMLInputElement).value = '';
            }
            else if (eventType === 'new_message_data') {
                const newMessageData = data.message;
                if (selectedChat === newMessageData.chatId) {
                    dispatch(addMessage(data.message));
                }
            }
        }
        socket!.addEventListener('message', handleMessageEvent);
        return () => {
            socket!.removeEventListener('message', handleMessageEvent);
        }
    }, []);
    React.useEffect(() => {
        if (wrapperRef.current) {
            if (initialRender || scrolledToBottom) {
                return;
            }
            else {
                wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
                setScrolledToBottom(currentState => {
                    return true;
                });
            }
        }
    }, [messages]);
    React.useEffect(() => {
        if (!initialRender) {
            socket!.send(JSON.stringify({
                eventType: 'getAllMessages',
                data: {
                    page: page,
                    limit: 10,
                    chatId: selectedChat
                }
            }));
        }
        else {
            setInitialRender(currentState => {
                return false;
            });
        }
    }, [page]);
    return (
        <Wrapper ref={wrapperRef}>
            {getAllChatMessagesLoading ? (
                <Loading title="Loading All Chat Messages" position='normal'/>
            ) : (
                <>
                    {(numberOfPages! > 1 && Number(page) < numberOfPages!) && (
                        <div>
                            <div onClick={() => {
                                dispatch(setPage(Number(page) + 1));
                            }} className="previous-replies-btn">Show Previous Messages</div>
                        </div>
                    )}
                    {!messages.length && (
                        <div className="center">
                            <div className="underline">No Messages</div>
                        </div>
                    )}
                    {messages.map((message) => {
                        return (
                            <MessageListItem key={nanoid()} data={message}/>
                        );
                    })}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    overflow: scroll;
    height: 100%;
    padding: 1rem;
    width: 100%;
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        .underline {
            border-bottom: 1px solid black;
        }
    }
    .previous-replies-btn {
        background-color: rgb(254, 253, 237);
        border-radius: 0.25rem;
        cursor: pointer;
        width: 100%;
        outline: 1px solid black;
        padding: 0.25rem;
        margin-bottom: 1rem;
        text-align: center;
    }
    .previous-replies-btn:hover {
        background-color: rgb(251, 243, 213);
    }
`;

export default MessageList;