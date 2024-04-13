import { configureStore } from '@reduxjs/toolkit'
import api from './api/api'
import authSlice from './reducers/auth'
import miscSlice from './reducers/misc'

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [api.reducerPath]: api.reducer,
        [miscSlice.name]: miscSlice.reducer,
    },
    middleware: d => d().concat(api.middleware)
})

export default store