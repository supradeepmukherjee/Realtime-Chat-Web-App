import { envMode } from "../app.js"

const errorMiddleware = async (err, req, res, next) => {
    err.message ||= 'Internal Server Error'
    err.status ||= 500
    if (err.code === 11000) {
        err.message = `Duplicate Field(s) - ${Object.keys(err.keyPattern).join(', ')}`
        err.status = 400
    }
    if (err.name === 'CastError') {
        err.message = `Invalid format of ${err.path}`
        err.status = 400
    }
    return res
        .status(err.status)
        .json({
            success: false,
            msg: envMode === 'DEVELOPMENT' ? err : err.message,
        })
}

const tryCatch = f => async (req, res, next) => {
    try {
        await f(req, res, next)
    } catch (err) {
        next(err)
    }
}

export { errorMiddleware, tryCatch }