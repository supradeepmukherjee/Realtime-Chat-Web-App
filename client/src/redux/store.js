import { configureStore } from '@reduxjs/toolkit'
import api from './api'
import authSlice from './reducers/auth'
import chatSlice from './reducers/chat'
import miscSlice from './reducers/misc'

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [api.reducerPath]: api.reducer,
        [miscSlice.name]: miscSlice.reducer,
        [chatSlice.name]: chatSlice.reducer,
    },
    middleware: d => d().concat(api.middleware)
})

export default store