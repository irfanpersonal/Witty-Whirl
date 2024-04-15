import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import moment from 'moment';
import {UserType, setIsEditing} from "../features/user/userSlice";
import {countries, allHobbies} from '../utils';
import {useDispatch, useSelector } from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {updateUser} from '../features/user/userThunk';

interface IUserInfoProps {
    data: UserType,
    viewType: 'simple' | 'advanced'
}

const UserInfo: React.FunctionComponent<IUserInfoProps> = ({data, viewType}) => {
    const dispatch = useDispatch<useDispatchType>();
    const {isEditing, updateUserLoading} = useSelector((store: useSelectorType) => store.user);
    const [hobbies, setHobbies] = React.useState<string[]>(Array.isArray(data.hobbies) ? data.hobbies : [data.hobbies]);
    const [showResults, setShowResults] = React.useState<boolean>(false);
    const [hobbyInput, setHobbyInput] = React.useState<string>('');
    const addHobby = (hobby: string) => {
        setHobbies(currentState => {
            return [...currentState, hobby];
        });
    }
    const removeHobby = (hobby: string) => {
        setHobbies(currentState => {
            return currentState.filter(item => item != hobby);
        });
    }
    return (
        <Wrapper>
            {viewType === 'advanced' ? (
                <>
                    <div className="user-info-container">
                        <img src={data.profilePicture || emptyProfilePicture} alt={data.name}/>
                        <div>
                            <div className="user-detail">Name: {isEditing ? <input id="name" type="text" name="name" defaultValue={data.name} required/> : data.name}</div>
                            <div className="user-detail">Country: {isEditing ? (
                                <select id="country" name="country" defaultValue={data.country} required>
                                    <option value=""></option>
                                    {countries.map(country => {
                                        return (
                                            <option key={country} value={country}>{country}</option>
                                        );
                                    })}
                                </select>
                            ) : (
                                data.country
                            )}</div>
                            <div className="user-detail">Email: {isEditing ? <input id="email" type="email" name="email" defaultValue={data.email} required/> : data.email}</div>
                            {isEditing && (
                                <> 
                                    <input onFocus={() => {
                                        setShowResults(currentState => {
                                            return true;
                                        })
                                    }} onBlur={() => {
                                        const theSearchResults = document.querySelector('.search-results') as HTMLDivElement;
                                        if (theSearchResults.matches(':active')) {
                                            return;
                                        }
                                        setShowResults(currentState => {
                                            return false;
                                        });
                                    }} id="allHobbies" type="search" value={hobbyInput} onChange={(event) => setHobbyInput(currentState => event.target.value)} placeholder='Search All Hobbies'/>
                                    {showResults && (
                                        <div className="search-results">
                                            {allHobbies.filter(hobby => hobby.toLowerCase().includes(hobbyInput.toLowerCase())).slice(0, 3).map(hobby => {
                                                return (
                                                    <div onClick={() => {
                                                        if (hobbies.includes(hobby)) {
                                                            removeHobby(hobby);
                                                        }
                                                        setShowResults(currentState => {
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
                                    {hobbies.length === 1 && (
                                        <div className="warning">Note: You need to have at least one hobby!</div>
                                    )}
                                    {hobbies.length === 5 && (
                                        <div className="warning">Note: You can have a maximum of five hobbies!</div>
                                    )}
                                </>
                            )}
                            <div className="hobbies">
                                {hobbies.map(hobby => {
                                    return (
                                        <div onClick={() => {
                                            if (!isEditing) {
                                                return;
                                            }
                                            if (hobbies.length === 1) {
                                                return;
                                            }
                                            if (hobbies.includes(hobby)) {
                                                setHobbies(currentState => {
                                                    return currentState.filter(singleHobby => singleHobby !== hobby);
                                                });
                                            }
                                        }} key={hobby} className={`hobby ${isEditing && 'cursor'}`}>{hobby} {isEditing && <span>X</span>}</div>
                                    );
                                })}
                            </div>
                            {isEditing && (
                                <label htmlFor="bio">Bio</label>
                            )}
                            <p className={`${(data.bio && !isEditing) && 'bio-text'}`}>{isEditing ? <textarea id="bio" name="bio" defaultValue={data.bio} placeholder='Enter in a bio!' required></textarea> : data.bio}</p>
                            {isEditing && (
                                <div className="warning">Note: After submitting a bio, you cannot leave it blank.</div>
                            )}
                            {isEditing && (
                                <>
                                    <label htmlFor="profilePicture">Profile Picture</label>
                                    <input id="profilePicture" type="file" name="profilePicture"/>
                                </>
                            )}
                            <div className="user-detail">Joined: {moment(data.createdAt).format('MMMM Do YYYY')}</div>
                            {!isEditing && (
                                <div className="btn" onClick={() => {
                                    dispatch(setIsEditing(true));
                                    setHobbies(currentState => {
                                        return Array.isArray(data.hobbies) ? data.hobbies : [data.hobbies]
                                    });
                                }}>Edit</div>
                            )}
                            {isEditing && (
                                <>
                                    <div className="btn" onClick={() => {
                                        if (updateUserLoading) {
                                            return;
                                        }
                                        const formData = new FormData();
                                        const nameValue = (document.querySelector('#name') as HTMLInputElement).value;
                                        const countryValue = (document.querySelector('#country') as HTMLInputElement).value;
                                        const emailValue = (document.querySelector('#email') as HTMLInputElement).value;
                                        const bioValue = (document.querySelector('#bio') as HTMLTextAreaElement).value;
                                        formData.append('name', nameValue);
                                        formData.append('country', countryValue);
                                        formData.append('email', emailValue);
                                        if (bioValue) {
                                            formData.append('bio', bioValue);
                                        }
                                        for (let i = 0; i < hobbies.length; i++) {
                                            formData.append('hobbies', hobbies[i]);
                                        }
                                        if ((document.querySelector('#profilePicture') as HTMLInputElement).files![0]) {
                                            formData.append('profilePicture', (document.querySelector('#profilePicture') as HTMLInputElement).files![0]);
                                        }
                                        dispatch(updateUser(formData));
                                    }}>{updateUserLoading ? 'Updating' : 'Update'}</div>
                                    <div className="btn" onClick={() => {
                                        dispatch(setIsEditing(false));
                                        setHobbies(currentState => {
                                            return Array.isArray(data.hobbies) ? data.hobbies : [data.hobbies];
                                        });
                                    }}>Cancel</div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="user-info-container padding">
                        <img src={data.profilePicture || emptyProfilePicture} alt={data.name}/>
                        <div>
                            <div className="user-detail">Name: {data.name}</div>
                            <div className="user-detail">Country: {data.country}</div>
                            <div className="user-detail">Email: {data.email}</div>
                            <div className="hobbies">
                                {hobbies.map(hobby => {
                                    return (
                                        <div onClick={() => {
                                            if (!isEditing) {
                                                return;
                                            }
                                            if (hobbies.length === 1) {
                                                return;
                                            }
                                            if (hobbies.includes(hobby)) {
                                                setHobbies(currentState => {
                                                    return currentState.filter(singleHobby => singleHobby !== hobby);
                                                });
                                            }
                                        }} key={hobby} className={`hobby ${isEditing && 'cursor'}`}>{hobby} {isEditing && <span>X</span>}</div>
                                    );
                                })}
                            </div>
                            {data.bio && (
                                <>
                                    <label htmlFor="bio">Bio</label>
                                    <p className={`bio-text`}>{data.bio}</p>
                                </>
                            )}
                            <div className="user-detail">Joined: {moment(data.createdAt).format('MMMM Do YYYY')}</div>
                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding-bottom: 1rem;
    .user-info-container {
        display: flex;
        img {
            width: 10rem;
            height: 10rem;
            outline: 1px solid black;
            margin-right: 1rem;
            margin-bottom: 1rem;
        }
        .user-detail {
            margin-bottom: 0.75rem;
        }
        .hobbies {
            display: flex;
            flex-wrap: wrap;
            .hobby {
                outline: 1px solid black;
                margin-right: 0.5rem;
                border-radius: 0.5rem;
                padding: 0.25rem 0.5rem;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                user-select: none;
            }
        }
        .btn {
            user-select: none;
            cursor: pointer;
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: black;
            color: white;
            margin-right: 1rem;
            margin-top: 0.25rem;
        }
        .btn:hover {
            background-color: white;
            color: black;
            outline: 1px solid black;
        }
        .btn:active {
            background-color: gray;
            color: white;
        }
        textarea {
            width: 100%;
            height: 5rem;
            resize: none;
            margin-top: 0.5rem;
        }
        #name, #country, #email, #bio {
            outline: 1px solid black;
        }
        #allHobbies {
            border: 1px solid black;
            width: 100%;
        }
        input, select, textarea {
            padding: 0.25rem;
            border: none;
            outline: none;
        }
        input[type="file"] {
            margin: 0.5rem 0;
            outline: 1px solid black;
            width: 100%;
            padding: 0.25rem;
            border-radius: 0.25rem;
            background-color: white;
        }
    }
    .bio-text {
        background-color: white;
        padding: 0.25rem;
        margin: 0.5rem 0;
        outline: 1px solid black;
    }
    .warning {
        outline: 1px solid black;
        background-color: white;
        margin: 0.5rem 0;
        padding: 0.25rem;
    }
    .cursor {
        cursor: pointer;
    }
    .search-results {
        position: relative;
        background-color: white;
        border-left: 1px solid black;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
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
    .padding {
        padding: 1rem;
    }
`;

export default UserInfo;