import React from 'react';
import styled from 'styled-components';
import {Loading, AllChats, MessageList, MessageInput} from '../components';
import {useSelector} from 'react-redux';
import {type useSelectorType} from '../store';

export const SocketContext = React.createContext<WebSocket | null>(null); 

const Home: React.FunctionComponent = () => {
    const {selectedChat} = useSelector((store: useSelectorType) => store.chat);
    const [socket, setSocket] = React.useState<WebSocket>();
    React.useEffect(() => {
        const socketConnection = new WebSocket('ws://localhost:4000');
        // We need to make sure the Web Socket Connection is open before we do 
        // anything like sending or setting it to a state.
        socketConnection.onopen = () => {
            setSocket(currentState => {
                return socketConnection;
            });
        }
        return () => {
            socketConnection.close();
        }
    }, []);
    return (
        <SocketContext.Provider value={socket!}>
            {socket ? (
                <Wrapper>
                    <div className="chat-list">
                        <AllChats/>
                    </div>
                    {selectedChat ? (
                        <div className="message-container">
                            <MessageList/>
                            <MessageInput/>
                        </div>
                    ) : (
                        <div className="no-chat-selected">
                            <div>Select a chat to start messaging!</div>
                        </div>
                    )}
                </Wrapper>
            ) : (
                <Loading title="Connecting to Web Socket Server" position='center'/>
            )}
        </SocketContext.Provider>
    );
}

const Wrapper = styled.div`
    display: flex;
    height: 100%;
    .chat-list {
        background-color: lightgray;
        width: 30%;
    }
    .no-chat-selected {
        width: 70%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        div {
            border-bottom: 1px solid black;
        }
    }
    .message-container {
        width: 70%;
        background-color: rgb(198, 235, 197);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1rem;
    }
`;

export default Home;