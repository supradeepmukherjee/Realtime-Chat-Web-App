import mongoose, { model, Schema, Types } from 'mongoose'

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    grpChat: {
        type: Boolean,
        default: false,
    },
    admin: [{
        type: Types.ObjectId,
        ref: 'ChatUser'
    }],
    members: [{
        type: Types.ObjectId,
        ref: 'ChatUser',
        max: 100
    }],
    chavi: {
        publicID: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
},
    { timestamps: true }
)

export const Chat = mongoose.models.Chat || model('Chat', schema)