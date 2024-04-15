import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {FaPlusSquare, FaUser} from "react-icons/fa";
import {type UserType} from "../features/user/userSlice";
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useSelectorType} from '../store';
import {SocketContext} from '../pages/Home';
import {toast} from 'react-toastify';

interface UserListItemProps {
    data: UserType
}

const UserListItem: React.FunctionComponent<UserListItemProps> = ({data}) => {
    const navigate = useNavigate();
    const socket = React.useContext(SocketContext);
    const {user} = useSelector((store: useSelectorType) => store.user);
    return (
        <Wrapper onClick={(event) => {
            const element = event.target as HTMLElement;
            if (element.tagName === 'IMG' || element.tagName === 'DIV') {
                navigate(`/profile/${data.id}`);
            }
            else if (element.tagName === 'BUTTON' || element.tagName === 'path' || element.tagName === 'svg') {
                if (data.id === user!.id) {
                    navigate('/profile');
                }
                else {
                    // Create Chat
                    socket!.send(JSON.stringify({
                        eventType: 'createChat', 
                        data: {
                            id: data.id
                        }
                    }));
                }
            }
        }}>
            <img src={data.profilePicture || emptyProfilePicture} alt={data.name}/>
            <div>{data.name}</div>
            <button>{data.id === user!.id ? <FaUser/> : <FaPlusSquare/>}</button>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    outline: 1px solid black;
    border-radius: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin: 1rem 0;
    img {
        width: 3rem;
        height: 3rem;
        outline: 1px solid black;
    }
    button {
        cursor: pointer;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        border: none;
        outline: 1px solid black;
    }
    button:hover {
        color: white;
        background-color: black;
    }
`;

export default UserListItem;