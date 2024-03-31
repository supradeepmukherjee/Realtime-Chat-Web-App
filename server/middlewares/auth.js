import jwt from 'jsonwebtoken'
import { ErrorHandler } from "../utils/utility.js"

export const isAuthenticated = (req, res, next) => {
    const { user } = req.cookies
    if (!user) return next(new ErrorHandler(401, 'Please Login first'))
    const { _id } = jwt.verify(user, process.env.JWT_SECRET)
    req.user = _id
    next()
}