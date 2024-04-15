import React from 'react';
import styled from 'styled-components';
import {type UserType} from '../features/user/userSlice';
import {UserListItem, PaginationBox} from '../components';
import {nanoid} from 'nanoid';
import {SocketContext} from '../pages/Home';
import {toast} from 'react-toastify';

interface UserListProps {
    data: UserType[],
    totalUsers: number,
    numberOfPages: number,
    page: number,
    changePage: Function,
    updateSearch: Function,
}

const UserList: React.FunctionComponent<UserListProps> = ({data, totalUsers, numberOfPages, page, changePage, updateSearch}) => {
    const socket = React.useContext(SocketContext);
    React.useEffect(() => {
        socket!.addEventListener('message', (event: MessageEvent<any>) => {
            const {eventType, data} = JSON.parse(event.data);
            if (eventType === 'createChat') {
                toast.success('Created Chat!');
                socket!.send(JSON.stringify({eventType: 'getAllChats', data: {
                    page: 1,
                    limit: 10
                }}));
            }
            else if (eventType === 'error') {
                toast.error(data.msg);
            }
        });
    }, []);
    return (
        <Wrapper>
            {totalUsers ? (
                <div className="list-info">
                    <div>{totalUsers} User{totalUsers! > 1 && 's'} Found...</div>
                </div>
            ): (
                <div style={{textAlign: 'center', marginTop: '1rem', textDecoration: 'underline'}}>No Users Found</div>
            )}
            <section>
                {data.map(item => {
                    return (
                        <UserListItem key={nanoid()} data={item}/>
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
    margin-top: 1rem;
    .list-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        margin-bottom: 1rem;
    }
`;

export default UserList;