import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import {FaFilter, FaTimes, FaSearch} from "react-icons/fa";
import {countries, allHobbies, capitalizeFirstLetter} from '../utils';
import {Loading, UserList} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {updateAllUsersSearchBoxValues} from '../features/chat/chatSlice';
import {SocketContext} from '../pages/Home';
import {setGetAllUsersLoading, setUsers, setTotalUsers, setNumberOfPages, setPage} from '../features/user/userSlice';

const AllUsers: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const [showFilterOptions, setShowFilterOptions] = React.useState(false);
    const {allUsersSearchBoxValues} = useSelector((store: useSelectorType) => store.chat);
    const {getAllUsersLoading, users, totalUsers, numberOfPages, page} = useSelector((store: useSelectorType) => store.user);
    const socket = React.useContext(SocketContext);
    React.useEffect(() => {
        socket!.send(JSON.stringify({
            eventType: 'getAllUsers', 
            data: {
                queryData: {
                    search: allUsersSearchBoxValues.search,
                    country: allUsersSearchBoxValues.country,
                    hobbies: !allUsersSearchBoxValues.hobbies.length ? '' : allUsersSearchBoxValues.hobbies,
                    sort: allUsersSearchBoxValues.sort,
                    page: page
                }
            }
        }));
        socket!.addEventListener('message', (event: MessageEvent<any>) => {
            const {eventType, data} = JSON.parse(event.data);
            if (eventType === 'getAllUsers') {
                const {users, totalUsers, numberOfPages} = data;
                dispatch(setUsers(users));
                dispatch(setTotalUsers(totalUsers));
                dispatch(setNumberOfPages(numberOfPages));
                dispatch(setGetAllUsersLoading(false));
            }
        });
    }, []);
    return (
        <Wrapper>
            <div className="search-user-box">
                <input id="search-input" type="search" name="search" value={allUsersSearchBoxValues.search} onChange={(event) => dispatch(updateAllUsersSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                <button onClick={() => {
                    setShowFilterOptions(currentState => {
                        return !currentState;
                    });
                }} id="filter">{showFilterOptions ? <FaTimes/> : <FaFilter/>}</button>
                <button onClick={() => {
                    dispatch(setGetAllUsersLoading(true));
                    socket!.send(JSON.stringify({
                        eventType: 'getAllUsers', 
                        data: {
                            queryData: {
                                search: allUsersSearchBoxValues.search,
                                country: allUsersSearchBoxValues.country,
                                hobbies: !allUsersSearchBoxValues.hobbies.length ? '' : allUsersSearchBoxValues.hobbies.length === 1 ? allUsersSearchBoxValues.hobbies[0] : allUsersSearchBoxValues.hobbies,
                                sort: allUsersSearchBoxValues.sort,
                                page: page
                            }
                        }
                    }));
                }} id="search"><FaSearch/></button>
            </div>
            {showFilterOptions && (
                <div className="filter-box">
                    <div>
                        <label htmlFor="country">Country</label>
                        <select id="country" name="country" value={allUsersSearchBoxValues.country} onChange={(event) => {
                            dispatch(updateAllUsersSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }}>
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
                        <Select id="hobbies" value={allUsersSearchBoxValues.hobbies.map((hobby) => {
                            return {
                                value: hobby,
                                label: capitalizeFirstLetter(hobby)
                            };
                        })} onChange={(selectedValuesArray) => {
                            const allValues = selectedValuesArray.map((selectedValue) => {
                                return selectedValue.value;
                            });
                            dispatch(updateAllUsersSearchBoxValues({name: 'hobbies', value: allValues}));
                        }} isMulti placeholder="" options={allHobbies.map((hobby: string) => {
                            return (
                                {
                                    value: hobby, 
                                    label: capitalizeFirstLetter(hobby)
                                }
                            );
                        })}></Select>
                    </div>
                    <div>
                        <label htmlFor="sort">Sort</label>
                        <select id="sort" name="sort" value={allUsersSearchBoxValues.sort} onChange={(event) => {
                            dispatch(updateAllUsersSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }}>
                            <option value=""></option>
                            <option value="oldest">Oldest</option>
                            <option value="latest">Latest</option>
                        </select>
                    </div>
                </div>
            )}
            {getAllUsersLoading ? (
                <Loading title="Get All Users" position='normal' />
            ) : (
                <UserList data={users} numberOfPages={numberOfPages as number} page={page as number} totalUsers={totalUsers as number} changePage={setPage} updateSearch={() => {
                    socket!.send(JSON.stringify({
                        eventType: 'getAllUsers', 
                        data: {
                            queryData: {
                                search: allUsersSearchBoxValues.search,
                                country: allUsersSearchBoxValues.country,
                                hobbies: !allUsersSearchBoxValues.hobbies.length ? '' : allUsersSearchBoxValues.hobbies.length === 1 ? allUsersSearchBoxValues.hobbies[0] : allUsersSearchBoxValues.hobbies,
                                sort: allUsersSearchBoxValues.sort,
                                page: page
                            }
                        }
                    }));
                }}/>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 15rem;
    overflow: scroll;
    padding: 0.5rem;
    .search-user-box {
        #search-input {
            width: 80%;
            border-top-left-radius: 0.20rem;
            border-bottom-left-radius: 0.20rem;
        }
        #filter {
            width: 10%;
        }
        #search {
            width: 10%;
            border-top-right-radius: 0.20rem;
            border-bottom-right-radius: 0.20rem;
        }   
        #search-input, #filter, #search {
            border: none;
            padding: 0.5rem;
            outline: none;
        }
        #filter, #search {
            cursor: pointer;
        }
        #filter:hover, #filter:active, #search:hover, #search:active {
            outline: 1px solid black;
            background-color: black;
            color: white;
        }
    }
    .filter-box {
        label {
            display: block;
            margin-top: 1rem;
        }
        select {
            border: none;
            border-radius: 0.2rem;
            outline: none;
            width: 100%;
            padding: 0.5rem;
        }
        select:focus {
            outline: 2px solid rgb(37, 132, 255);
        }
    }
`;

export default AllUsers;