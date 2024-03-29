export const sample = [
    {
        chavi: ['https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png',],
        name: 'himan being',
        _id: '1',
        members: [1, 2],
        grpChat: false
    },
    {
        chavi: ['https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png',],
        name: 'human being',
        _id: '2',
        members: [1, 2],
        grpChat: false
    },
    {
        chavi: ['https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png', 'https://w3schools.com/howto/img_avatar.png',],
        name: 'human being',
        _id: '2',
        members: [1, 2],
        grpChat: false
    },
]

export const sampleUsers = [
    {
        _id: '1',
        chavi: 'https://w3schools.com/howto/img_avatar.png',
        name: 'Human Being',
    },
    {
        _id: '2',
        chavi: 'https://w3schools.com/howto/img_avatar.png',
        name: 'Human Being2',
    },
]

export const sampleNotifications = [
    {
        _id: '1',
        sender: {
            chavi: 'https://w3schools.com/howto/img_avatar.png',
            _id: '1'
        }
    },
    {
        _id: '2',
        sender: {
            chavi: 'https://w3schools.com/howto/img_avatar.png',
            _id: '2'
        }
    },
]

export const sampleMsgs = [
    {
        attachments: [
            {
                publicId: 'hdfbdhbhbib',
                url: 'https://w3schools.com/howto/img_avatar.png'
            },
        ],
        content: 'Sample Message',
        _id: 'fm3qm2m34k9de',
        sender: {
            _id: 'user._id',
            name: 'Human Being'
        },
        chat: 'chat._id',
        createdAt: '2024-03-21T16:02:02.252Z'
    },
    {
        attachments: [
            {
                publicId: 'hdfbdhbhbib',
                url: 'https://w3schools.com/howto/img_avatar.png'
            },
        ],
        content: 'Sample Message2',
        _id: 'fm3qm2mfsfdfer34k9de',
        sender: {
            _id: 'jnbhjfirurb',
            name: 'Human Being2'
        },
        chat: 'chat._id',
        createdAt: '2024-03-21T16:02:02.252Z'
    },
]

export const dashboardData = {
    users: [
        {
            name: 'Human being',
            chavi: 'https://w3schools.com/howto/img_avatar.png',
            _id: '1',
            uName: 'hb',
            friends: 20,
            grp: 5,
        },
        {
            name: 'Human being',
            chavi: 'https://w3schools.com/howto/img_avatar.png',
            _id: '2',
            uName: 'hb2',
            friends: 30,
            grp: 10,
        },
    ],
    chats: [
        {
            name: 'New Group',
            chavi: ['https://w3schools.com/howto/img_avatar.png'],
            _id: '1',
            grpChat: false,
            members: [
                {
                    _id: '1',
                    chavi: 'https://w3schools.com/howto/img_avatar.png',
                },
                {
                    _id: '2',
                    chavi: 'https://w3schools.com/howto/img_avatar.png',
                },
            ],
            totalMembers: 2,
            totalMsgs: 20,
            creator: {
                name: 'Human Being',
                chavi: 'https://w3schools.com/howto/img_avatar.png',
            }
        },
        {
            name: 'New Group2',
            chavi: ['https://w3schools.com/howto/img_avatar.png'],
            _id: '2',
            grpChat: false,
            members: [
                {
                    _id: '1',
                    chavi: 'https://w3schools.com/howto/img_avatar.png',
                },
                {
                    _id: '2',
                    chavi: 'https://w3schools.com/howto/img_avatar.png',
                },
                {
                    _id: '3',
                    chavi: 'https://w3schools.com/howto/img_avatar.png',
                },
            ],
            totalMembers: 3,
            totalMsgs: 30,
            creator: {
                name: 'Human Being2',
                chavi: 'https://w3schools.com/howto/img_avatar.png',
            }
        },
    ],
    msgs: [
        {
            attachments: [],
            content: 'Sample Msg',
            _id: '12',
            sender: {
                chavi: 'https://w3schools.com/howto/img_avatar.png',
                name: 'Human Being',
            },
            chatID: "chatID",
            grpChat: false,
            createdAt: '2024-03-28T08:25:25.863Z'
        },
        {
            attachments: [{
                publicId: 'lqugqdaf8',
                url: 'https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg'
            }],
            content: '',
            _id: '324',
            sender: {
                chavi: 'https://w3schools.com/howto/img_avatar.png',
                name: 'Human Being2',
            },
            chatID: "chatID2",
            grpChat: true,
            createdAt: '2024-03-29T08:25:25.863Z'
        },
        {
            attachments: [{
                publicId: 'lqug36126qf8',
                url: 'https://w3schools.com/howto/img_avatar.png'
            }],
            content: 'Sample Msg2',
            _id: '314',
            sender: {
                chavi: 'https://w3schools.com/howto/img_avatar.png',
                name: 'Human Being2',
            },
            chatID: "chatID2",
            grpChat: true,
            createdAt: '2024-03-29T08:25:25.863Z'
        },
    ]
}