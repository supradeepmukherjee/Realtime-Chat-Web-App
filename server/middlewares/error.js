const errorMiddleware = async (err, req, res, next) => {
    err.message ||= 'Internal Server Error'
    err.status ||= 500
    return res.status(err.status).json({ msg: err.message, success: false })
}

const tryCatch = f => async (req, res, next) => {
    try {
        await f(req, res, next)
    } catch (err) {
        next(err)
    }
}

export { errorMiddleware, tryCatch }