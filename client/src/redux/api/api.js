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
        searchUser: builder.query({
            query: name => ({
                url: `/user/search?name=${name}`,
                credentials: 'include'
            }),
            providesTags: ['User']
        }),
        getNotifications: builder.query({
            query: () => ({
                url: `/user/notifications`,
                credentials: 'include'
            }),
            keepUnusedDataFor: 0
        }),
        sendFriendRequest: builder.mutation({
            query: data => ({
                url: `/user/sendReq`,
                method: `POST`,
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ['User']
        }),
    })
})

export default api
export const { useMyChatsQuery, useLazySearchUserQuery, useSendFriendRequestMutation, useGetNotificationsQuery } = api