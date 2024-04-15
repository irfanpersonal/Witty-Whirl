import {createSlice} from '@reduxjs/toolkit';
import {showCurrentUser, registerUser, loginUser, logoutUser, getProfileData, updateUser, getSingleUser} from './userThunk';
import {toast} from 'react-toastify';

export type UserType = {
    id: string,
    name: string,
    email: string,
    bio: string,
    country: string,
    hobbies: string[],
    profilePicture: string,
    createdAt: string,
    updatedAt: string
};

interface IUser {
    globalLoading: boolean,
    authLoading: boolean,
    logoutUserLoading: boolean,
    getProfileDataLoading: boolean,
    wantsToRegister: boolean,
    isEditing: boolean,
    updateUserLoading: boolean,
    user: UserType | null,
    singleUser: UserType | null,
    getSingleUserLoading: boolean,
    getAllUsersLoading: boolean,
    users: UserType[],
    totalUsers: number | null,
    numberOfPages: number | null,
    page: number | null
}

const initialState: IUser = {
    globalLoading: true,
    authLoading: false,
    logoutUserLoading: false,
    getProfileDataLoading: true,
    wantsToRegister: true,
    isEditing: false,
    updateUserLoading: false,
    user: null,
    singleUser: null,
    getSingleUserLoading: true,
    getAllUsersLoading: true,
    users: [],
    totalUsers: null,
    numberOfPages: null,
    page: 1
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleAuthType: (state) => {
            state.wantsToRegister = !state.wantsToRegister;
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
        },
        setGetAllUsersLoading: (state, action) => {
            state.getAllUsersLoading = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setTotalUsers: (state, action) => {
            state.totalUsers = action.payload;
        },
        setNumberOfPages: (state, action) => {
            state.numberOfPages = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(showCurrentUser.pending, (state) => {
            state.globalLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.globalLoading = false;
            state.user = action.payload;
        }).addCase(showCurrentUser.rejected, (state, action) => {
            state.globalLoading = false;
        }).addCase(registerUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Registered User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(loginUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(logoutUser.pending, (state) => {
            state.logoutUserLoading = true;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.logoutUserLoading = false;
            state.user = null;
            toast.success('Successfully Logged Out!');
        }).addCase(logoutUser.rejected, (state) => {
            state.logoutUserLoading = false;
        }).addCase(getProfileData.pending, (state) => {
            state.getProfileDataLoading = true;
        }).addCase(getProfileData.fulfilled, (state, action) => {
            state.getProfileDataLoading = false;
            state.user = action.payload;
        }).addCase(getProfileData.rejected, (state, action) => {
            state.getProfileDataLoading = false;
        }).addCase(updateUser.pending, (state) => {
            state.updateUserLoading = true;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.updateUserLoading = false;
            state.user = action.payload;
            toast.success('Updated User!');
        }).addCase(updateUser.rejected, (state, action) => {
            state.updateUserLoading = false;
            toast.error(action.payload as string);
        }).addCase(getSingleUser.pending, (state) => {
            state.getSingleUserLoading = true;
        }).addCase(getSingleUser.fulfilled, (state, action) => {
            state.getSingleUserLoading = false;
            state.singleUser = action.payload;
        }).addCase(getSingleUser.rejected, (state) => {
            state.getSingleUserLoading = true;
        });
    }
});

export const {toggleAuthType, setIsEditing, setGetAllUsersLoading, setUsers, setTotalUsers, setNumberOfPages, setPage} = userSlice.actions;

export default userSlice.reducer;