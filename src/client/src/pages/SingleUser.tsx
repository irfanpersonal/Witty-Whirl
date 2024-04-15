import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getSingleUser} from '../features/user/userThunk';
import {useNavigate, useParams} from 'react-router-dom';
import {Loading, UserInfo} from '../components';

const SingleUser: React.FunctionComponent = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {singleUser, getSingleUserLoading, user} = useSelector((store: useSelectorType) => store.user);
    React.useEffect(() => {
        if (id === user!.id) {
            navigate('/profile');
        }
        dispatch(getSingleUser(id!));
    }, []);
    return (
        <div>
            {getSingleUserLoading ? (
                <Loading title="Loading Single User" position='normal' marginTop='1rem'/>
            ) : (
                <UserInfo data={singleUser!} viewType='simple'/>
            )}
        </div>
    );
}

export default SingleUser;