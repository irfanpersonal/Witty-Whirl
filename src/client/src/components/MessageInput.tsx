import React from 'react';
import styled from 'styled-components';
import {MdSend, MdScheduleSend} from "react-icons/md";
import {SocketContext} from '../pages/Home';
import {useSelector} from 'react-redux';
import {useSelectorType} from '../store';

const MessageInput: React.FunctionComponent = () => {
    const socket = React.useContext(SocketContext)!;
    const {selectedChat} = useSelector((store: useSelectorType) => store.chat); 
    const handleMessageEvent = () => {
        const messageInput = (document.querySelector('#message') as HTMLInputElement);
        if (!messageInput.value) {
            messageInput.style.border = '1px solid red';
            setTimeout(() => {
                messageInput.style.border = '';
            }, 2000);
        }
        socket.send(JSON.stringify({
            eventType: 'createMessage',
            data: {
                chatId: selectedChat,
                text: messageInput.value
            }
        }));
    }
    return (
        <Wrapper>
            <input id="message" type="text" name="message"/>
            <button onClick={handleMessageEvent}><MdSend/></button>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    input {
        width: 90%;
    }
    button {
        width: 10%;
    }
    input, button {
        border: none;
        outline: none;
        padding: 0.25rem;
    }
`;

export default MessageInput;