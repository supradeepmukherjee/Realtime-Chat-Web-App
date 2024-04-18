import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../../constants/config'

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: server }),
    tagTypes: ['Chat', 'User', 'Msg'],
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
        sendRequest: builder.mutation({
            query: data => ({
                url: `/user/sendReq`,
                method: `POST`,
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ['User']
        }),
        acceptRequest: builder.mutation({
            query: data => ({
                url: `/user/acceptReq`,
                method: `PUT`,
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ['Chat']
        }),
        chatDetails: builder.query({
            query: ({ id, populate = 0 }) => ({
                url: `/chat/${id}?populate=${populate}`,
                credentials: 'include'
            }),
            providesTags: ['Chat']
        }),
        getMsgs: builder.query({
            query: ({ id, page }) => ({
                url: `/chat/msg/${id}?page=${page}`,
                credentials: 'include'
            }),
            providesTags: ['Msg']
        }),
        sendAttachments: builder.mutation({
            query: data => ({
                url: `/chat/attachment`,
                method: `POST`,
                body: data,
                credentials: 'include'
            }),
        }),
    })
})

export default api
export const { useMyChatsQuery, useLazySearchUserQuery, useSendRequestMutation, useGetNotificationsQuery, useAcceptRequestMutation, useChatDetailsQuery, useLazyGetMsgsQuery, useSendAttachmentsMutation } = api