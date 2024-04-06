import { body, check, param, validationResult } from 'express-validator'
import { ErrorHandler } from '../utils/utility.js'

const validateHandler = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) next()
    else next(new ErrorHandler(400, errors.array().map(({ msg }) => msg).join(', ')))
}

const registerValidator = () => [
    body('name', 'Please Enter name').notEmpty(),
    body('uName', 'Please Enter Username').notEmpty(),
    body('password', 'Please Enter Password').notEmpty(),
    body('bio', 'Please Enter Bio').notEmpty(),
    check('chavi', 'Please Upload Chavi').notEmpty()
]

const loginValidator = () => [
    body('uName', 'Please Enter Username').notEmpty(),
    body('password', 'Please Enter Password').notEmpty(),
]

const newGrpValidator = () => [
    body('name', 'Please Enter Group Name').notEmpty(),
    body('members').notEmpty().withMessage('Please Select the People to be Added').isArray({ min: 2, max: 99 }).withMessage('A group must have atleast 2 people')
]

const addMembersValidator = () => [
    body('id', 'Please Enter Group ID').notEmpty(),
    body('members').notEmpty().withMessage('Please Select the People to be Added').isArray({ min: 1 }).withMessage('Please select atleast 1 person')
]

const removeMemberValidator = () => [
    body('chatID', 'Please Enter Group ID').notEmpty(),
    body('userID', 'Please Enter User ID').notEmpty(),
]

const sendAttachmentsValidator = () => [
    body('id', 'Please Enter Chat ID').notEmpty(),
    check('files').notEmpty().withMessage('Please Upload Files').isArray({ min: 1, max: 5 }).withMessage('1 to 5 Files can be sent at once')
]

const chatIDValidator = () => [param('id', 'Please Enter Chat ID').notEmpty()]

const renameGrpValidator = () => [
    param('id', 'Please Enter Group ID').notEmpty(),
    body('name', 'Please Enter new Name').notEmpty(),
]

const sendRequestValidator = () => [body('id', 'Please Enter user ID').notEmpty()]

const acceptRequestValidator = () => [
    body('id', 'Please Enter Request ID').notEmpty(),
    body('accept')
        .notEmpty().withMessage('Please either Accept or Reject')
        .isBoolean().withMessage('Please enter a boolean value for accept field')
]

export { validateHandler, registerValidator, loginValidator, newGrpValidator, addMembersValidator, removeMemberValidator, sendAttachmentsValidator, chatIDValidator, renameGrpValidator, sendRequestValidator, acceptRequestValidator }