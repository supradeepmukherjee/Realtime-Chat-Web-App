import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../constants/config'

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
            providesTags: ['Chat']//this might be causing some error
        }),
        searchUser: builder.query({
            query: ({ name, friend = 0 }) => ({
                url: `/user/search?name=${name}&friend=${friend}`,
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
            keepUnusedDataFor: 0
        }),
        sendAttachments: builder.mutation({
            query: data => ({
                url: `/chat/attachment`,
                method: `POST`,
                body: data,
                credentials: 'include'
            }),
        }),
        myGrps: builder.query({
            query: () => ({
                url: '/chat/my-grps',
                credentials: 'include'
            }),
            providesTags: ['Chat']
        }),
        myFriends: builder.query({
            query: ({ name, id }) => {
                let url = `/user/friends`
                if (id) url += `?id=${id}&name=${name}`
                return {
                    url,
                    credentials: 'include'
                }
            },
        }),
        newGrp: builder.mutation({
            query: data => ({
                url: `/chat/new`,
                method: `POST`,
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ['Chat']
        }),
        renameGrp: builder.mutation({
            query: ({ id, name }) => ({
                url: `/chat/${id}`,
                method: `PUT`,
                body: { name },
                credentials: 'include'
            }),
            invalidatesTags: ['Chat']
        }),
        removeMember: builder.mutation({
            query: data => ({
                url: `/chat/remove-member`,
                method: `PUT`,
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ['Chat']
        }),
        addMembers: builder.mutation({
            query: data => ({
                url: `/chat/add-members`,
                method: `PUT`,
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ['Chat']
        }),
        delChat: builder.mutation({
            query: id => ({
                url: `/chat/${id}`,
                method: `DELETE`,
                credentials: 'include'
            }),
            invalidatesTags: ['Chat']
        }),
        leaveGrp: builder.mutation({
            query: id => ({
                url: `/chat/leave/${id}`,
                method: `PUT`,
                credentials: 'include'
            }),
            invalidatesTags: ['Chat']
        }),
        getOnline: builder.query({
            query: () => ({
                url: `/user/online`,
                credentials: 'include'
            }),
            keepUnusedDataFor: 0,
            invalidatesTags: ['Chat']
        }),
    })
})

export default api
export const { useMyChatsQuery, useLazySearchUserQuery, useSendRequestMutation, useGetNotificationsQuery, useAcceptRequestMutation, useChatDetailsQuery, useLazyGetMsgsQuery, useSendAttachmentsMutation, useMyGrpsQuery, useMyFriendsQuery, useNewGrpMutation, useRenameGrpMutation, useRemoveMemberMutation, useAddMembersMutation, useLazyMyFriendsQuery, useDelChatMutation, useLeaveGrpMutation, useGetOnlineQuery } = api