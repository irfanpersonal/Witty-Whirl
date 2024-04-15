import React from 'react';
import styled, {css} from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {RegisterBox, LoginBox} from '../components';
import {type useDispatchType, type useSelectorType} from '../store';
import {toggleAuthType} from '../features/user/userSlice';
import {registerUser, loginUser} from '../features/user/userThunk';
import {useNavigate} from 'react-router-dom';

const Auth: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {wantsToRegister, authLoading, user} = useSelector((store: useSelectorType) => store.user);
    const [hobbies, setHobbies] = React.useState<string[]>([]);
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
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (wantsToRegister) {
            formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
            formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
            formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
            formData.append('country', (target.elements.namedItem('country') as HTMLSelectElement).value);
            hobbies.forEach(hobby => {
                formData.append('hobbies', hobby);
            });
            dispatch(registerUser(formData));
            return;
        }
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value)
        formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value)
        dispatch(loginUser(formData));
    }
    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1 className="auth-type">{wantsToRegister ? 'Register' : 'Login'}</h1>
                {wantsToRegister ? (
                    <RegisterBox hobbies={hobbies} addHobby={addHobby} removeHobby={removeHobby}/>
                ) : (
                    <LoginBox/>
                )}
                <p className="toggle-option" onClick={() => dispatch(toggleAuthType())}>{wantsToRegister ? 'Already have an account?' : `Don't have an account?`}</p>
                <button type="submit" disabled={authLoading}>{authLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: rgb(161, 195, 152);
    user-select: none;
    form {
        width: 50%;
        .auth-type {
            text-align: center;
        }
        label {
            display: block;
        }
        input, select {
            margin-bottom: 0.5rem;
        }
        input, select, button {
            padding: 0.25rem;
            width: 100%;
            border: none;
            outline: 1px solid black;
            background-color: rgb(198, 235, 197);
        }
        input:focus {
            outline: 0.25rem solid rgb(45, 120, 101);
        }
        .toggle-option {
            margin-top: 0.5rem;
            text-align: center;
            cursor: pointer;
        }
        .toggle-option:hover {
            color: white;
        }
        button {
            cursor: pointer;
            margin-top: 0.5rem;
            background-color: rgb(197, 234, 170);
        }
        button:hover {
            background-color: rgb(45, 119, 101);
            color: white;
        }
        button:active {
            background-color: black;
            color: white;
        }
    }
`;

export default Auth;