import {createSlice} from '@reduxjs/toolkit';
import {toast} from 'react-toastify';

export type ChatType = {
    id: string,
    recipientToMessageId: string,
    recipientToMessage: {
        name: string,
        profilePicture: string
    },
    creatorId: string,
    creator: {
        name: string,
        profilePicture: string
    },
    onlineStatus: {
        creator: boolean,
        recipientToMessage: boolean
    },
    createdAt: Date,
    updatedAt: Date
};

interface IChat {
    getAllChatsLoading: boolean,
    chats: ChatType[],
    totalChats: number | null,
    numberOfPages: number | null,
    page: number | '',
    selectedChat: string,
    showCreateChatBox: boolean,
    allUsersSearchBoxValues: {
        search: string,
        country: string,
        hobbies: string[],
        sort: string
    }
}

const initialState: IChat = {
    getAllChatsLoading: true,
    chats: [],
    totalChats: null,
    numberOfPages: null,
    page: 1,
    selectedChat: '',
    showCreateChatBox: false,
    allUsersSearchBoxValues: {
        search: '',
        country: '',
        hobbies: [],
        sort: ''
    }
};

const userSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setTotalChats: (state, action) => {
            state.totalChats = action.payload;
        },
        setNumberOfPages: (state, action) => {
            state.numberOfPages = action.payload;
        },
        setGetAllChatsLoading: (state, action) => {
            state.getAllChatsLoading = action.payload;
        },
        toggleShowCreateChatBox: (state) => {
            state.showCreateChatBox = !state.showCreateChatBox;
        },
        updateAllUsersSearchBoxValues: (state, action) => {
            state.allUsersSearchBoxValues[action.payload.name as keyof typeof state.allUsersSearchBoxValues] = action.payload.value
        }
    },
    extraReducers: (builder) => {
        
    }
});

export const {setPage, setSelectedChat, setChats, setTotalChats, setNumberOfPages, setGetAllChatsLoading, toggleShowCreateChatBox, updateAllUsersSearchBoxValues} = userSlice.actions;

export default userSlice.reducer;