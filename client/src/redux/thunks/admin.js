import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { server } from '../../constants/config'

const config = {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
}

const adminLogin = createAsyncThunk('admin/login', async key => {
    try {
        const { data } = await axios.put(`${server}/admin/login`,
            { key },
            config
        )
        return data.msg
    } catch (err) {
        console.log(err)
        throw err.response.data.msg
    }
})

const checkAdmin = createAsyncThunk('admin/check', async () => {
    try {
        const { data } = await axios.get(`${server}/admin`, { withCredentials: true })
        return data.admin
    } catch (err) {
        console.log(err)
        throw err.response.data.msg
    }
})

const adminLogout = createAsyncThunk('admin/logout', async () => {
    try {
        const { data } = await axios.get(`${server}/admin/logout`, { withCredentials: true })
        return data.msg
    } catch (err) {
        console.log(err)
        throw err.response.data.msg
    }
})

export { adminLogin, checkAdmin, adminLogout }