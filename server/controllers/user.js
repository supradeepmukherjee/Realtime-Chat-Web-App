import { compare } from 'bcrypt'
import { User } from '../models/User.js'
import { sendToken } from '../utils/features.js'

const register = async (req, res) => {
    const { name, uName, password, bio } = req.body
    const chavi = {
        publicID: 'fsjriurwiu',
        url: 'ehg2ry9230042nf209094'
    }
    const user = await User.create({ name, uName, password, chavi, bio })
    sendToken(res, user, 201, 'Registration Successful')
}

const login = async (req, res, next) => {
    const { uName, password } = req.body
    const user = await User.findOne({ uName }).select('+password')
    if (!user) return next(new Error('Invalid Credentials'))
    const isMatch = await compare(password, user.password)
    if (!isMatch) return next(new Error('Invalid Credentials'))
    sendToken(res, user, 200, `Welcome Back, ${user.name}`)
}

const getMyProfile = async (req, res) => {

}

export { login, register, getMyProfile }