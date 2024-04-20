import { createSlice } from '@reduxjs/toolkit'
import { new_msg_alert } from '../../constants/events'
import { getOrSave_Storage } from '../../lib/features'

const initialState = {
    notificationCount: 0,
    newMsgsAlert: getOrSave_Storage(true, new_msg_alert) ||  [{
        id: '',
        count: 0
    }]
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        incrementNotificationCount: state => {
            state.notificationCount += 1
        },
        resetNotificationCount: state => {
            state.notificationCount = 0
        },
        setNewMsgsAlert: (state, action) => {
            const i = state.newMsgsAlert.findIndex(({ id }) => id === action.payload)
            if (i !== -1) state.newMsgsAlert[i].count += 1
            else state.newMsgsAlert.push({ id: action.payload, count: 1 })
        },
        removeMsgsAlert: (state, action) => {
            state.newMsgsAlert = state.newMsgsAlert.filter(({ id }) => id !== action.payload)
        }
    }
})

export default chatSlice
export const { incrementNotificationCount, resetNotificationCount, setNewMsgsAlert, removeMsgsAlert } = chatSlice.actions