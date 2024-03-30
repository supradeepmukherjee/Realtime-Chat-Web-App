import { hash } from 'bcrypt'
import mongoose, { model, Schema } from 'mongoose'

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    uName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: 8
    },
    chavi: {
        publicID: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    }
},
    { timestamps: true }
)

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await hash(this.password, 10)
})

export const User = mongoose.models.ChatUser || model('ChatUser', schema)