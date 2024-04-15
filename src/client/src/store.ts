import {configureStore} from '@reduxjs/toolkit';
import navigationReducer from './features/navigation/navigationSlice';
import userReducer from './features/user/userSlice';
import chatReducer from './features/chat/chatSlice';
import messageReducer from './features/message/messageSlice';

const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        user: userReducer,
        chat: chatReducer,
        message: messageReducer
    }
});

export type useDispatchType = typeof store.dispatch;

export type useSelectorType = ReturnType<typeof store.getState>;

export default store;