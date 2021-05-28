import { createSlice } from '@reduxjs/toolkit';
import {User} from "../../models/Type";

interface AppState {
    isSignIn: boolean,
    user: User | null,
}

const initialState : AppState = {
    isSignIn: false,
    user: null,
}

const slice = createSlice({
    name: 'App',
    initialState: initialState,
    reducers: {
        signIn: (state, action) => {
            state.isSignIn = true;
            state.user = action.payload;
        },
        signOut: (state) => {
            state.isSignIn = false;
            state.user = null;
        }
    },
});

export const Selector = {
    isSignIn: (state : {app: AppState}) => {
        return state.app.isSignIn
    },
    getUser: (state : {app: AppState}) => {
        return state.app.user;
    },
    isAdmin: (state : {app: AppState}) => {
        const user = Selector.getUser(state)
        return user?.email === 'iq.at.sk131@gmail.com';
    },
};

export const Action = slice.actions;
export const Reducer = slice.reducer;