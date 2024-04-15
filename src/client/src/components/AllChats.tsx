import React from 'react';
import styled from 'styled-components';
import {SocketContext} from '../pages/Home';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {setPage, setChats, setTotalChats, setNumberOfPages, setGetAllChatsLoading, toggleShowCreateChatBox} from '../features/chat/chatSlice';
import {FaEdit} from "react-icons/fa";
import {Loading, Modal, AllUsers, ChatList} from '../components';

const AllChats: React.FunctionComponent = () => {
    const {getAllChatsLoading, chats, totalChats, numberOfPages, page, showCreateChatBox} = useSelector((store: useSelectorType) => store.chat);
    const dispatch = useDispatch<useDispatchType>();
    const socket = React.useContext(SocketContext);
    React.useEffect(() => {
        socket!.send(JSON.stringify({
            eventType: 'getAllChats', 
            data: {
                page: page,
                limit: 10
            }
        }));
        socket!.addEventListener('message', (event: MessageEvent<any>) => { 
            const {eventType, data} = JSON.parse(event.data);
            if (eventType === 'getAllChats') {
                dispatch(setChats(data.chats));
                dispatch(setTotalChats(data.totalChats));
                dispatch(setNumberOfPages(data.numberOfPages));
                dispatch(setGetAllChatsLoading(false));
            }
        });
    }, []);
    return (
        <Wrapper>
            <div className="search-box">
                <input type="search" name="search" placeholder='Search for Specific Chat'/>
                <button onClick={() => {
                    dispatch(toggleShowCreateChatBox());
                }} title="Create Chat"><FaEdit/></button>
            </div>
            {getAllChatsLoading ? (
                <Loading title="Loading All Chats" position='normal'/>
            ) : (
                <div className="space-top">
                    <ChatList data={chats} numberOfPages={numberOfPages as number} page={page as number} totalChats={totalChats as number} changePage={setPage} updateSearch={() => {
                        socket!.send(JSON.stringify({
                            eventType: 'getAllChats', 
                            data: {
                                page: page,
                                limit: 10
                            }
                        }));
                    }}/>
                </div>
            )}
            {showCreateChatBox && (
                <Modal title='Create Chat' toggleModal={() => dispatch(toggleShowCreateChatBox())}>
                    <AllUsers/>
                </Modal>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    overflow: scroll;
    height: 100%;
    padding: 1rem;
    .search-box {
        input {
            width: 80%;
        }
        button {
            cursor: pointer;
            width: 20%;
        }
        button:hover, button:active {
            outline: 1px solid black;
            background-color: black;
            color: white;
        }
        input, button {
            padding: 0.5rem;
            border: none;
            outline: none;
        }
    }
    .space-top {
        margin-top: 1rem;
    }
`;

export default AllChats;