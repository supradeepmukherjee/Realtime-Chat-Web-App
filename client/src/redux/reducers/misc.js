import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isNewGrp: false,
    isAddMember: false,
    isNotification: false,
    isMobile: false,
    isSearch: false,
    isFileMenu: false,
    isDelChat: false,
    isLogout: false,
    uploadingLoader: false,
    isDelGrp: false,
    isEditAccount: false,
    isDelAccount: false,
    selectedDelChat: {
        name: null,
        id: null,
        grp: false
    },
    isDelMsg: false,
    selectedDelMsg: null
}

const miscSlice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        setIsNewGrp: (state, action) => {
            state.isNewGrp = action.payload
        },
        setIsAddMember: (state, action) => {
            state.isAddMember = action.payload
        },
        setIsNotification: (state, action) => {
            state.isNotification = action.payload
        },
        setIsMobile: (state, action) => {
            state.isMobile = action.payload
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload
        },
        setIsDelChat: (state, action) => {
            state.isDelChat = action.payload
        },
        setIsLogout: (state, action) => {
            state.isLogout = action.payload
        },
        setUploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload
        },
        setSelectedDelChat: (state, action) => {
            state.selectedDelChat = action.payload
        },
        setIsDelGrp: (state, action) => {
            state.isDelGrp = action.payload
        },
        setIsEditAccount: (state, action) => {
            state.isEditAccount = action.payload
        },
        setIsDelAccount: (state, action) => {
            state.isDelAccount = action.payload
        },
        setIsDelMsg: (state, action) => {
            state.isDelMsg = action.payload
        },
        setSelectedDelMsg: (state, action) => {
            state.selectedDelMsg = action.payload
        },
    }
})

export default miscSlice
export const { setIsAddMember, setIsMobile, setIsNewGrp, setIsNotification, setIsSearch, setIsDelChat, setIsFileMenu, setIsLogout, setSelectedDelChat, setUploadingLoader, setIsDelGrp, setIsEditAccount, setIsDelAccount, setIsDelMsg, setSelectedDelMsg } = miscSlice.actions