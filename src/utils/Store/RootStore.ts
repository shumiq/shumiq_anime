import { configureStore } from '@reduxjs/toolkit'
import {Reducer} from "./AppStore";

export const store = configureStore({
    reducer: {
        app: Reducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;