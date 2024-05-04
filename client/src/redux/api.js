import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../constants/config'

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: server }),
    tagTypes: ['Chat', 'User', 'Dashboard', 'Dashboard-Users', 'Dashboard-Chats', 'Dashboard-Msgs'],
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
        }),
        lastSeen: builder.query({
            query: id => ({
                url: `/user/last-seen/${id}`,
                credentials: 'include'
            }),
            keepUnusedDataFor: 0,
        }),
        unread: builder.query({
            query: id => ({
                url: `/user/unread/${id}`,
                credentials: 'include'
            }),
            keepUnusedDataFor: 0,
            invalidatesTags: ['Chat']
        }),
        read: builder.mutation({
            query: ({ userID, chatID }) => ({
                url: `/user/read/${userID}?chat=${chatID}`,
                credentials: 'include',
                method: 'PUT'
            }),
            keepUnusedDataFor: 0,
            invalidatesTags: ['Chat']
        }),
        toggleAdmin: builder.mutation({
            query: data => ({
                url: `/chat/make-admin`,
                method: `PUT`,
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ['Chat']
        }),
        getAdminData: builder.query({
            query: () => ({
                url: '/admin',
                credentials: 'include'
            }),
            providesTags: ['Dashboard']
        }),
        getAdminUsers: builder.query({
            query: () => ({
                url: '/admin/users',
                credentials: 'include'
            }),
            providesTags: ['Dashboard-Users']
        }),
        getAdminChats: builder.query({
            query: () => ({
                url: '/admin/chats',
                credentials: 'include'
            }),
            providesTags: ['Dashboard-Chats']
        }),
        getAdminMsgs: builder.query({
            query: () => ({
                url: '/admin/msgs',
                credentials: 'include'
            }),
            providesTags: ['Dashboard-Msgs']
        }),
        updateProfile: builder.mutation({
            query: data => {
                console.log(data)
                return ({
                    url: `/user/update-profile`,
                    method: `PUT`,
                    body: data,
                    credentials: 'include'
                })
            },
            invalidatesTags: ['User']
        }),
        updatePassword: builder.mutation({
            query: data => ({
                url: `/user/update-password`,
                method: `PUT`,
                body: data,
                credentials: 'include'
            }),
            invalidatesTags: ['User']
        }),
        myProfile: builder.query({
            query: () => ({
                url: '/user/my-profile',
                credentials: 'include'
            }),
            providesTags: ['User']
        }),
    })
})

export default api
export const { useMyChatsQuery, useLazySearchUserQuery, useSendRequestMutation, useGetNotificationsQuery, useAcceptRequestMutation, useChatDetailsQuery, useLazyGetMsgsQuery, useSendAttachmentsMutation, useMyGrpsQuery, useMyFriendsQuery, useNewGrpMutation, useRenameGrpMutation, useRemoveMemberMutation, useAddMembersMutation, useLazyMyFriendsQuery, useDelChatMutation, useLeaveGrpMutation, useGetOnlineQuery, useLazyLastSeenQuery, useUnreadQuery, useReadMutation, useLazyUnreadQuery, useToggleAdminMutation, useGetAdminDataQuery, useGetAdminChatsQuery, useGetAdminMsgsQuery, useGetAdminUsersQuery, useUpdateProfileMutation, useUpdatePasswordMutation, useLazyMyProfileQuery } = api