import React from 'react';
import styled from 'styled-components';
import {FaMessage} from "react-icons/fa6";
import {Link} from 'react-router-dom';

const Landing: React.FunctionComponent = () => {
    return (
        <Wrapper>
            <div className="black-bar"></div>
            <h1 className="title">Witty Whirl</h1>
            <div className="chat-icon"><FaMessage/></div>
            <div className="chat-feature">
                <div className="text">Real Time Chatting</div>
            </div>
            <div className="chat-feature">
                <div className="text">Connect based on Hobbies</div>
            </div>
            <div className="chat-feature">
                <div className="text">Super Fast and Beautiful</div>
            </div>
            <Link to='/auth' className="get-started">Get Started</Link>
            <div className="black-bar"></div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(161, 195, 152);
    height: 100%;
    user-select: none;
    .title {
        color: #333;
        font-size: 2.5rem;
        border-bottom: 1px solid black;
        font-family: monospace;
        margin-top: 1rem;
    }
    .chat-icon {
        font-size: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 5rem; 
        width: 5rem;
        margin: 1rem 0;
        color: rgb(44, 120, 101);
    }
    .chat-feature {
        outline: 1px solid black;
        padding: 1rem;
        width: 50%;
        text-align: center;
        margin-bottom: 1rem;
        border-radius: 2rem;
        background-color: rgb(198, 235, 197);
        .text {
            font-size: 1.25rem;
        }
    }
    a {
        cursor: pointer;
        padding: 0.75rem 2rem;
        background-color: rgb(197, 235, 170);
        color: black;
        border: none;
        border-radius: 0.25rem;
        transition: background-color 0.3s ease;
        text-decoration: none;
        margin-bottom: 1rem;
        &:hover {
            background-color: rgb(44, 120, 101);
            color: white;
        }
    }
    .black-bar {
        width: 100%;
        height: 1rem;
        background-color: black;
    }
`;

export default Landing;