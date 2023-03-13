import { configureStore } from "@reduxjs/toolkit";
import todoReducer from './features/todoSlice'

//An store that will manage all the states of the app
//is configured with redux toolkit, and receive the slice
//of the todoReducer, that is in charge of all the API calls.
export const store = configureStore({
    reducer : {
        todo: todoReducer
    }
})