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
    creator: {
        type: Types.ObjectId,
        ref: 'ChatUser'
    },
    members: [{
        type: Types.ObjectId,
        ref: 'ChatUser'
    }],
},
    { timestamps: true }
)

export const Chat = mongoose.models.Chat || model('Chat', schema)