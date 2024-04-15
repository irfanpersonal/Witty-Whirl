import React from 'react';
import styled from 'styled-components';
import {countries, allHobbies} from '../utils';
import {nanoid} from 'nanoid';

interface RegisterBoxProps {
    hobbies: string[],
    addHobby: Function,
    removeHobby: Function
}

const RegisterBox: React.FunctionComponent<RegisterBoxProps> = ({hobbies, addHobby, removeHobby}) => {
    const [showResult, setShowResult] = React.useState<boolean>(false);
    const [hobbyInput, setHobbyInput] = React.useState('');
    return (
        <Wrapper>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" name="name" required={true}/>
            </div>
            <div>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" name="email" required={true}/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" required={true}/>
            </div>
            <div>
                <label htmlFor="country">Country</label>
                <select id="country" name="country">
                    <option value=""></option>
                    {countries.map(country => {
                        return (
                            <option key={country} value={country}>{country}</option>
                        );
                    })}
                </select>
            </div>
            <div>
                <label htmlFor="hobbies">Hobbies</label>
                <div className={`selected-hobbies ${hobbies.length >= 1 && 'space-out'}`}>
                    {hobbies.map(hobby => {
                        return (
                            <span key={nanoid()} className="selected-hobby">{hobby} <span style={{cursor: 'pointer'}} onClick={() => {
                                removeHobby(hobby);
                            }}>X</span></span>
                        );
                    })}
                </div>
                <input id="hobbies" name="hobbies" type="search" onFocus={() => {
                    setShowResult(currentState => {
                        return true;
                    });
                }} onBlur={() => {
                    const theSearchResults = document.querySelector('.search-results') as HTMLDivElement;
                    if (theSearchResults.matches(':active')) {
                        return;
                    }
                    setShowResult(currentState => {
                        return false;
                    });
                }} value={hobbyInput} onChange={(event) => setHobbyInput(currentState => event.target.value)}/>
                {showResult && (
                    <div className="search-results">
                        {allHobbies.filter(hobby => hobby.toLowerCase().includes(hobbyInput.toLowerCase())).slice(0, 3).map(hobby => {
                            return (
                                <div onClick={() => {
                                    if (hobbies.includes(hobby)) {
                                        removeHobby(hobby);
                                    }
                                    setShowResult(currentState => {
                                        return false;
                                    });
                                    if (!hobbies.includes(hobby) && hobbies.length !== 5) {
                                        addHobby(hobby);
                                        setHobbyInput(currentState => {
                                            return '';
                                        });
                                    }
                                }} className={`hobby ${hobbies.includes(hobby) && 'selected'}`}>{hobby}</div>
                            );
                        })}
                        {allHobbies.filter(hobby => hobby.toLowerCase().includes(hobbyInput.toLowerCase())).length === 0 && (
                            <div className="nothing-found">No Hobby Found</div>
                        )}
                    </div>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: relative;
    .space-out {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }
    .selected-hobbies {
        .selected-hobby {
            outline: 1px solid black;
            border-radius: 1rem;
            margin-right: 0.5rem;
            padding: 0.25rem;
            user-select: none;
        }
    }
    .search-results {
        position: absolute;
        top: calc(100% + 5px);
        z-index: 1;
        width: 100%;
        background-color: white;    
        outline: 1px solid black;
        .selected {
            background-color: black;
            color: white;
        }
        .hobby {
            cursor: pointer;
            padding: 0.25rem;
        }
        .hobby:hover {
            color: white;
            background-color: gray;
        }
    }
    .nothing-found {
        text-align: center;
        text-decoration: underline;
    }
`;

export default RegisterBox;