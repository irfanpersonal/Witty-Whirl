import {createSlice} from '@reduxjs/toolkit';
import {getCurrentPageLocation} from '../../utils';
import {getSingleUser} from '../user/userThunk';

interface INavigate {
    location: string
}

const initialState: INavigate = {
    location: getCurrentPageLocation()
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getSingleUser.rejected, (state) => {
            state.location = state.location === `/` ? `/#` : `/`;
        });
    }
});

export const {} = navigationSlice.actions;

export default navigationSlice.reducer;