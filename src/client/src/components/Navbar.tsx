import React from 'react';
import styled from 'styled-components';
import {TbWhirl} from "react-icons/tb";
import {FaUser} from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux';
import {MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp} from "react-icons/md";
import {type useDispatchType, type useSelectorType} from '../store';
import {useNavigate} from 'react-router-dom';
import {logoutUser} from '../features/user/userThunk';

const Navbar: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {user, logoutUserLoading} = useSelector((store: useSelectorType) => store.user);
    const [showUserBoxOptions, setShowUserBoxOptions] = React.useState<boolean>(false);
    return (
        <Wrapper>
            <h1 className="logo" onClick={() => {
                navigate('/');
            }}><span><TbWhirl/></span>Witty Whirl</h1>
            <div>
                <div className="user-box" onClick={() => {
                    setShowUserBoxOptions(currentState => {
                        return !currentState;
                    });
                }}>
                <div><span><FaUser/></span></div>
                <div className="name">{user?.name}</div>
                <div>
                    <span>{showUserBoxOptions ? <MdOutlineKeyboardArrowUp/> : <MdOutlineKeyboardArrowDown/>}</span>
                </div>
            </div>
                {showUserBoxOptions && (
                    <div className="user-dropdown" onClick={(event) => {
                        const target = event.target as HTMLDivElement;
                        if (target.textContent === 'Profile' || target.textContent === 'Logout') {
                            setShowUserBoxOptions(currentState => {
                                return false;
                            });
                        }
                    }}>
                        <div className="user-dropdown-option" onClick={() => {
                            navigate('/profile');
                        }}>Profile</div>
                        <div className="user-dropdown-option logout" onClick={() => {
                            if (logoutUserLoading) {
                                return;
                            }
                            dispatch(logoutUser());
                        }}>{logoutUserLoading ? 'Logging Out' : 'Logout'}</div>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: rgb(161, 195, 152);
    :first-child {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            margin-right: 0.5rem;
        }
    }
    .user-box {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid black;
        padding: 0.25rem 1rem;
        user-select: none;
        background-color: white;
        .name {
            margin-left: 0.5rem;
            margin-right: 0.5rem;
        }
    }
    .user-dropdown {
        position: absolute;
        text-align: center;
        background-color: lightgray;
        padding: 0.25rem;
        width: 8.4rem;
        border-left: 1px solid black;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
        .user-dropdown-option {
            cursor: pointer;
        }
        .user-dropdown-option:hover {
            background-color: white;
        }
        .logout:hover {
            background-color: lightcoral;
        }
    }
`;

export default Navbar;