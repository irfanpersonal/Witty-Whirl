import React from 'react';
import styled from 'styled-components';
import {type ChatType} from '../features/chat/chatSlice';
import {PaginationBox, ChatListItem} from '../components';
import {nanoid} from 'nanoid';

interface ChatListProps {
    data: ChatType[],
    totalChats: number,
    numberOfPages: number,
    page: number,
    changePage: Function,
    updateSearch: Function,
    _id?: string
}

const ChatList: React.FunctionComponent<ChatListProps> = ({data, totalChats, numberOfPages, page, changePage, updateSearch, _id}) => {
    return (
        <Wrapper>
            {totalChats ? (
                <div className="list-info">
                    <div>{totalChats} Chat{totalChats! > 1 && 's'} Found...</div>
                </div>
            ): (
                <div style={{textAlign: 'center', marginTop: '1rem', textDecoration: 'underline'}}>No Chats Found</div>
            )}
            <section>
                {data.map(item => {
                    return (
                        <ChatListItem data={item} key={nanoid()}/>
                    );
                })}
            </section>
            {numberOfPages! > 1 && (
                <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={changePage} updateSearch={updateSearch}/>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.section`
    .list-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        margin-bottom: 1rem;
    }
`;

export default ChatList;