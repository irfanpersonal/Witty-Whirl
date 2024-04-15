import {createSlice} from '@reduxjs/toolkit';

export type MessageType = {
    id: string,
    chatId: string,
    chat: {
        recipientToMessageId: string,
        creatorId: string
    },
    senderId: string,
    sender: {
        name: string,
        profilePicture: string
    }
    text: string,
    createdAt: string,
    updatedAt: string
};

interface IMessage {
    getAllChatMessagesLoading: boolean,
    messages: MessageType[],
    totalMessages: number | null,
    numberOfPages: number | null,
    page: number | ''
}

const initialState: IMessage = {
    getAllChatMessagesLoading: true,
    messages: [],
    totalMessages: null,
    numberOfPages: null,
    page: 1
};

const userSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = [...action.payload, ...state.messages];
        },
        setTotalMessages: (state, action) => {
            state.totalMessages = action.payload;
        },
        setNumberOfPages: (state, action) => {
            state.numberOfPages = action.payload;
        },
        setGetAllChatMessagesLoading: (state, action) => {
            state.getAllChatMessagesLoading = action.payload;
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        reset: (state) => {
            state.getAllChatMessagesLoading = true;
            state.messages = [];
            state.totalMessages = null;
            state.numberOfPages =  null;
            state.page = 1;
        }
    },
    extraReducers: (builder) => {
        
    }
});

export const {setPage, setMessages, setTotalMessages, setNumberOfPages, setGetAllChatMessagesLoading, addMessage, reset} = userSlice.actions;

export default userSlice.reducer;