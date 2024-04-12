import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../../constants/config'

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: server }),
    tagTypes: ['Chat', 'User'],
    endpoints: builder => ({
        myChats: builder.query({
            query: () => ({
                url: '/chat/my-chats',
                credentials: 'include'
            }),
            providesTags: ['Chat']
        }),
        // searchUser: builder.query({
        //     query: search => ({
        //         url: '/user/search',
        //         credentials: 'include'
        //     }),
        //     providesTags: ['User']
        // }),
    })
})

export default api
export const { useMyChatsQuery } = api