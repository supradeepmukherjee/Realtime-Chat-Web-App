import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notificationCount: 0,
    newMsgsAlert: [{
        chat: '',
        qty: 0
    }]
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        incrementNotificationCount: state => {
            state.notificationCount += 1
        },
        setNotificationCount: (state, action) => {
            state.notificationCount = action.payload
        },
        resetNotificationCount: state => {
            state.notificationCount = 0
        },
        setFreshNewMsgsAlert: (state, action) => {
            state.newMsgsAlert = action.payload
        },
        setNewMsgsAlert: (state, action) => {
            const i = state.newMsgsAlert.findIndex(({ chat }) => chat === action.payload)
            if (i !== -1) state.newMsgsAlert[i].qty += 1
            else state.newMsgsAlert.push({ chat: action.payload, qty: 1 })
        },
        removeMsgsAlert: (state, action) => {
            state.newMsgsAlert = state.newMsgsAlert.filter(({ chat }) => chat !== action.payload)
        }
    }
})

export default chatSlice
export const { incrementNotificationCount, resetNotificationCount, setNewMsgsAlert, removeMsgsAlert, setNotificationCount, setFreshNewMsgsAlert } = chatSlice.actions