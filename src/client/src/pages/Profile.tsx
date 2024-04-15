import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, UserInfo} from '../components';
import {getProfileData} from '../features/user/userThunk';

const Profile: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getProfileDataLoading, user} = useSelector((store: useSelectorType) => store.user);
    React.useEffect(() => {
        dispatch(getProfileData(user!.id));
    }, []);
    return (
        <Wrapper>
            {getProfileDataLoading ? (
                <Loading title='Loading Profile Data' position='normal'/>
            ) : (
                <>
                    <h1 style={{borderBottom: '1px solid black', marginBottom: '1rem'}}>My Profile</h1>
                    <UserInfo data={user!} viewType='advanced'/>
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100%;
    padding: 1rem;
`;

export default Profile;